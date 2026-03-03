const express = require('express');
const { getCustomers, getOrdersByCustomerId } = require('../configs/customerDB');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const customersList = await getCustomers();
    res.json(customersList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ordersList = await getOrdersByCustomerId(parseInt(id));
    const totalAmount = ordersList.reduce((accumulator, current) => accumulator + current?.total, 0)
    
    res.json({
      count: ordersList?.length,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
