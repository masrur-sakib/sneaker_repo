const express = require('express');
const router = express.Router();
const { Drop, Reservation } = require('../models');
const { createReservation } = require('../services/reservationService');
const { getIO } = require('../socket');

/**
 * Method: POST
 * Route: /api/reservations
 * Action: Create an atomic reservation (60s hold)
 */
router.post('/', async (req, res) => {
  try {
    const { dropId, userId } = req.body;

    if (!dropId || !userId) {
      return res.status(400).json({
        error: 'dropId and userId are required',
      });
    }

    const result = await createReservation(dropId, userId);

    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }

    // Broadcast updated stock with websocket event
    const io = getIO();
    const drop = await Drop.findByPk(dropId);
    io.emit('stock-updated', {
      dropId,
      availableStock: drop.availableStock,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Method: DELETE
 * Route: /api/reservations/:id
 * Action: cancel a reservation and restore stock
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if reservation is expired
    if (reservation.status !== 'active') {
      return res.status(400).json({
        error: `Cannot cancel reservation with status: ${reservation.status}`,
      });
    }

    // Get the associated drop to restore stock
    const drop = await Drop.findByPk(reservation.dropId);

    if (drop) {
      // Restore the reserved stock
      const updatedDrop = await drop.update({
        availableStock: drop.availableStock + 1,
      });

      // Emit socket event for real-time update
      const io = getIO();
      if (io) {
        io.emit('stock-updated', {
          dropId: drop.id,
          availableStock: updatedDrop.availableStock,
        });
      }
    }

    // Delete the reservation
    await reservation.destroy();

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
