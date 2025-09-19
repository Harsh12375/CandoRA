const mongoose = require('mongoose');
const Sweet = require('../models/Sweet');

// POST /api/sweets/:id/purchase
async function purchaseSweet(req, res, next) {
  try {
    const { id } = req.params;
    const amount = Math.max(1, Number(req.body.amount || 1));

    const updated = await Sweet.findOneAndUpdate(
      { _id: id, quantity: { $gte: amount } },
      { $inc: { quantity: -amount } },
      { new: true }
    );

    if (!updated) return res.status(400).json({ message: 'Insufficient stock or sweet not found' });
    res.json(updated);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) return res.status(400).json({ message: 'Invalid sweet id' });
    next(err);
  }
}

// POST /api/sweets/:id/restock (Admin only - enforced in route)
async function restockSweet(req, res, next) {
  try {
    const { id } = req.params;
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Amount must be a positive number' });

    const updated = await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity: amount } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Sweet not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { purchaseSweet, restockSweet };
