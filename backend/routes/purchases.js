const express = require('express');
const router = express.Router();
const { sequelize, Reservation, Purchase, Drop, User } = require('../models');
const { cancelExpiration } = require('../services/expirationService');
const { getIO } = require('../socket');

/**
 * Method: POST
 * Route: /api/purchases
 * Action: Complete a purchase for an active reservation
 */
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'reservationId is required',
      });
    }

    // Lock reservation
    const reservation = await Reservation.findByPk(reservationId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!reservation || reservation.status !== 'active') {
      await transaction.rollback();
      return res.status(409).json({
        error: 'Reservation is invalid or expired',
      });
    }

    // Create purchase
    const drop = await Drop.findByPk(reservation.dropId);
    const purchase = await Purchase.create(
      {
        userId: reservation.userId,
        dropId: reservation.dropId,
        reservationId: reservation.id,
        pricePaid: drop.price,
      },
      { transaction },
    );

    // Mark reservation as completed
    reservation.status = 'completed';
    await reservation.save({ transaction });

    await transaction.commit();

    // Cancel expiration timer
    cancelExpiration(reservation.id);

    // Broadcast purchaser name with websocket event
    const io = getIO();
    const user = await User.findByPk(reservation.userId);
    io.emit('purchase-completed', {
      dropId: reservation.dropId,
      username: user.username,
    });

    res.status(201).json({
      success: true,
      purchase,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
