const Sweet = require('../models/Sweet');

// POST /api/sweets
async function createSweet(req, res, next) {
  try {
    const { name, category, price, quantity } = req.body;
    const exists = await Sweet.findOne({ name });
    if (exists) return res.status(409).json({ message: 'Sweet with this name already exists' });

    const sweet = await Sweet.create({ name, category, price, quantity });
    res.status(201).json(sweet);
  } catch (err) {
    next(err);
  }
}

// GET /api/sweets
async function getSweets(req, res, next) {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (err) {
    next(err);
  }
}

// GET /api/sweets/search
async function searchSweets(req, res, next) {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.json(sweets);
  } catch (err) {
    next(err);
  }
}

// PUT /api/sweets/:id
async function updateSweet(req, res, next) {
  try {
    const { id } = req.params;
    const update = req.body;
    const sweet = await Sweet.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json(sweet);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/sweets/:id (Admin only - enforced in route)
async function deleteSweet(req, res, next) {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByIdAndDelete(id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ message: 'Sweet deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSweet, getSweets, searchSweets, updateSweet, deleteSweet };
