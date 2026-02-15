const express = require('express');
const router = express.Router();
const { User } = require('../models');

/**
 * Method: POST
 * Route: /api/users
 * Action: create a new user
 */
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        error: 'username and email are required',
      });
    }

    const user = await User.create({ username, email });

    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Username or email already exists',
      });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * Method: POST
 * Route: /api/users/login
 * Action: login existing user
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Method: GET
 * Route: /api/users
 * Action: get all users
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email'],
      order: [['createdAt', 'DESC']],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
