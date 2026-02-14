const express = require('express');
const router = express.Router();

const { Drop } = require('../models');
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
    const drop = await Drop.findByPk(dropId);
    getIO().emit('stock-updated', {
      dropId,
      availableStock: drop.availableStock,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
