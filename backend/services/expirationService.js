const { sequelize, Drop, Reservation } = require('../models');
const expirationTimeouts = new Map();
const { getIO } = require('../socket');

// Store timeout references (for cancellation of reservation)
function scheduleExpirationCheck(reservationId, dropId, delayMs) {
  const timeoutId = setTimeout(async () => {
    await expireReservation(reservationId, dropId);
  }, delayMs);

  expirationTimeouts.set(reservationId, timeoutId);
}

// Expire method will auto run after 60ms
async function expireReservation(reservationId, dropId) {
  const transaction = await sequelize.transaction();

  try {
    const reservation = await Reservation.findByPk(reservationId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    // Only expire if still active
    if (reservation && reservation?.status === 'active') {
      reservation.status = 'expired';
      await reservation.save({ transaction });

      // Return stock
      await Drop.increment('availableStock', {
        by: 1,
        where: { id: dropId },
        transaction,
      });

      await transaction.commit();

      // Broadcast updated stock with websocket event
      const updatedDrop = await Drop.findByPk(dropId);
      getIO().emit('stock-updated', {
        dropId,
        availableStock: updatedDrop.availableStock,
      });

      return true;
    }

    await transaction.commit();
    return false;
  } catch (error) {
    await transaction.rollback();
    console.error('Expiration error:', error);
  }
}

// After successful purchase in memory timeout will be cancelled
function cancelExpiration(reservationId) {
  const timeoutId = expirationTimeouts.get(reservationId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    expirationTimeouts.delete(reservationId);
  }
}

module.exports = {
  scheduleExpirationCheck,
  expireReservation,
  cancelExpiration,
};
