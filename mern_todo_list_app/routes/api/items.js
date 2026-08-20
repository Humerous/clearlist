const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// <--- ITEM MODEL IMPORTED --->
const Item = require('../../models/Item');

// <--- GET ROUTE --->
router.get('/', (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
});

// <--- POST ROUTE --->
router.post('/', auth, (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ msg: 'Please enter an item name' });
  }

  const newItem = new Item({
    name,
  });

  newItem.save().then((item) => res.json(item));
});

// <--- DELETE ROUTE BY IDs --->
router.delete('/:id', auth, (req, res) => {
  Item.findById(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ unsuccessful: 'Item not found' });
      }

      return item
        .deleteOne()
        .then(() => res.json({ success: 'Item removed' }));
    })
    .catch((err) => res.status(404).json({ unsuccessful: 'Item not found' }));
});

module.exports = router;
