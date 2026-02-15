const { sequelize, Drop, Reservation, User } = require('../models');
const { scheduleExpirationCheck } = require('../services/expirationService');

async function createReservation(dropId, userId) {
  const transaction = await sequelize.transaction();
  let reservation;

  try {
    const drop = await Drop.findByPk(dropId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!drop || drop.availableStock <= 0) {
      await transaction.rollback();
      return {
        success: false,
        error: !drop ? 'Drop not found' : 'Out of stock',
      };
    }

    // Check if user already has an active reservation for this drop
    const existingReservation = await Reservation.findOne({
      where: {
        userId: userId,
        dropId: dropId,
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

    await drop.decrement('availableStock', { by: 1, transaction });

    const expiresAt = new Date(Date.now() + 60 * 1000);
    reservation = await Reservation.create(
      { userId, dropId, expiresAt, status: 'active' },
      { transaction },
    );

    await transaction.commit(); // Transaction is officially finished here
  } catch (error) {
    // Only rollback if the transaction hasn't been committed yet
    if (transaction) await transaction.rollback();
    throw error;
  }

  // schedule expiration check
  try {
    if (typeof scheduleExpirationCheck === 'function') {
      scheduleExpirationCheck(reservation.id, dropId, 60000);
    } else {
      console.error('Warning: scheduleExpirationCheck is not defined');
    }
  } catch (schedError) {
    console.error('Failed to schedule expiration:', schedError);
  }

  return {
    success: true,
    reservation,
    expiresAt: reservation.expiresAt,
  };
}

module.exports = { createReservation };
