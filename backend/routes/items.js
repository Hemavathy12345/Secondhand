const express = require('express');
const Item = require('../models/Item');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

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

const validateItemData = (data) => {
  const errors = [];
  if (!data.title || data.title.trim() === '') errors.push('Title is required');
  if (!data.description || data.description.trim() === '') errors.push('Description is required');
  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) errors.push('Valid price is required');
  if (!data.category || data.category.trim() === '') errors.push('Category is required');
  if (!data.condition || data.condition.trim() === '') errors.push('Condition is required');
  return errors;
};

router.get('/', async (req, res) => {
  const { search, priceMin, priceMax, category, condition, location, sort } = req.query;
  const query = { status: 'available' };
  if (search) query.title = { $regex: search, $options: 'i' };
  if (priceMin) query.price = { $gte: Number(priceMin) };
  if (priceMax) query.price = { ...query.price, $lte: Number(priceMax) };
  if (category) query.category = category;
  if (condition) query.condition = condition;
  if (location) query['location.lat'] = { $exists: true }; // Simplified location filter
  const sortOptions = sort === 'priceLow' ? { price: 1 } : sort === 'priceHigh' ? { price: -1 } : { createdAt: -1 };
  try {
    const items = await Item.find(query).sort(sortOptions).populate('sellerId', 'name');
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('sellerId', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: err.message });
  }
});
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const itemData = {
    ...req.body,
    sellerId: req.userId,
  };
  if (req.file) {
    itemData.image = `/uploads/${req.file.filename}`;
  }

  const errors = validateItemData(itemData);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const item = new Item(itemData);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(400).json({ message: err.message });
  }
});
router.patch('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.sellerId.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(item, req.body);
    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    }

    const errors = validateItemData(item);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.sellerId.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: err.message });
  }
});

router.use('/uploads', express.static(uploadDir));

module.exports = router;
