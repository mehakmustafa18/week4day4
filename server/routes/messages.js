const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a room
router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a new message
router.post('/', async (req, res) => {
  try {
    const { roomId, sender, text } = req.body;
    const newMessage = new Message({ roomId, sender, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
