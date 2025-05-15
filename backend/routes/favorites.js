const express = require('express');
const Favorite = require('../models/Favorite');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId }).populate('itemId');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  try {
    const favorite = new Favorite({
      userId: req.userId,
      itemId
    });
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:itemId', authMiddleware, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.userId, itemId: req.params.itemId });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;