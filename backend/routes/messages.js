const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
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
    const messages = await Message.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }]
    }).populate('senderId receiverId', 'name');
    const conversations = {};
    for (const msg of messages) {
      const otherUserId = msg.senderId._id.toString() === req.userId ? msg.receiverId._id.toString() : msg.senderId._id.toString();
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = { user: msg.senderId._id.toString() === req.userId ? msg.receiverId : msg.senderId, unread: 0 };
      }
      if (msg.receiverId._id.toString() === req.userId && !msg.read) {
        conversations[otherUserId].unread++;
      }
    }
    res.json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.userId }
      ]
    }).populate('senderId receiverId', 'name');
    await Message.updateMany(
      { receiverId: req.userId, senderId: req.params.userId, read: false },
      { read: true }
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const message = new Message({
      senderId: req.userId,
      receiverId,
      content
    });
    const newMessage = await message.save();
    await newMessage.populate('senderId receiverId', 'name');
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;