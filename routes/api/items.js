const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Item = require('../../models/Item');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ date: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ msg: 'Unable to load tasks' });
  }
});

router.post('/', auth, async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ msg: 'Please enter a task name' });
  }

  try {
    const item = await Item.create({
      user: req.user.id,
      name,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ msg: 'Unable to create task' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await item.deleteOne();
    res.json({ success: true });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.status(500).json({ msg: 'Unable to delete task' });
  }
});

module.exports = router;
