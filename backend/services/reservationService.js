const { sequelize, Drop, Reservation, User } = require('../models');

async function createReservation(dropId, userId) {
  // transaction with row-level locking
  const transaction = await sequelize.transaction();

  try {
    // SELECT FOR UPDATE locks the row,
    // preventing other transactions from reading/modifying
    // until this transaction completes
    const drop = await Drop.findByPk(dropId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!drop) {
      await transaction.rollback();
      return { success: false, error: 'Drop not found' };
    }

    if (drop.availableStock <= 0) {
      await transaction.rollback();
      return { success: false, error: 'Out of stock' };
    }

    // Check if user already has an active reservation for this drop
    const existingReservation = await Reservation.findOne({
      where: {
        UserId: userId,
        DropId: dropId,
        status: 'active',
      },
      transaction,
    });

    if (existingReservation) {
      await transaction.rollback();
      return {
        success: false,
        error: 'You already have an active reservation',
      };
    }

    // Decrement stock atomically
    await drop.decrement('availableStock', { by: 1, transaction });

    // Create reservation with 60-second expiry
    const expiresAt = new Date(Date.now() + 60 * 1000);
    const reservation = await Reservation.create(
      {
        UserId: userId,
        DropId: dropId,
        expiresAt,
        status: 'active',
      },
      { transaction },
    );

    await transaction.commit();

    // Schedule expiration check
    scheduleExpirationCheck(reservation.id, dropId, 60000);

    return {
      success: true,
      reservation,
      expiresAt,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = { createReservation };
