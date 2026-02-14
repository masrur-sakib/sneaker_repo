const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { Drop, Purchase, User } = require('../models');

/**
 * Method: POST
 * Route: /api/drops
 * Action: create a new drop
 */
router.post('/', async (req, res) => {
  try {
    const { name, price, totalStock, startsAt, endsAt, imageUrl } = req.body;

    if (!name || !price || totalStock == null) {
      return res.status(400).json({
        error: 'name, price, and totalStock are required',
      });
    }

    const drop = await Drop.create({
      name,
      price,
      totalStock,
      availableStock: totalStock,
      startsAt: startsAt || new Date(),
      endsAt: endsAt || null,
      imageUrl,
    });

    res.status(201).json(drop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Method: GET
 * Route: /api/drops
 * Action: all drops with (live stock & latest 3 purchasers)
 */
router.get('/', async (req, res) => {
  try {
    const now = new Date();

    const drops = await Drop.findAll({
      where: {
        startsAt: { [Op.lte]: now }, // started before now
        [Op.or]: [
          { endsAt: null }, // no end time
          { endsAt: { [Op.gte]: now } }, // end time is in the future
        ],
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Purchase,
          limit: 3,
          separate: true, // not globally, per drop
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    res.json(drops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
