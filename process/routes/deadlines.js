const express = require('express');
const Deadline = require('../models/Deadline');
const { auth, superAuthOnly, authOrOrgHead } = require('../middleware/auth');

const router = express.Router();

// GET /api/deadlines — public
router.get('/', async (req, res) => {
  try {
    const { committee, status, sort } = req.query;
    const filter = {};
    if (committee) filter.committee = { $regex: committee, $options: 'i' };
    if (status) filter.status = status;

    let sortObj = { date: 1 };
    if (sort === 'newest') sortObj = { date: -1 };
    if (sort === 'priority') sortObj = { priority: -1, date: 1 };

    const deadlines = await Deadline.find(filter)
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email')
      .sort(sortObj);

    res.json(deadlines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/deadlines/stats — public
router.get('/stats', async (req, res) => {
  try {
    const total = await Deadline.countDocuments();
    const completed = await Deadline.countDocuments({ status: 'completed' });
    const pending = await Deadline.countDocuments({ status: 'pending' });
    const overdue = await Deadline.countDocuments({ status: 'overdue' });
    
    const byCommittee = await Deadline.aggregate([
      { $group: { _id: '$committee', total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
      { $sort: { total: -1 } }
    ]);

    const upcoming = await Deadline.find({ status: 'pending', date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);

    res.json({ total, completed, pending, overdue, byCommittee, upcoming });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/deadlines — auth + org head or super
router.post('/', auth, authOrOrgHead, async (req, res) => {
  try {
    const deadline = new Deadline({ ...req.body, createdBy: req.user._id });
    await deadline.save();
    const populated = await Deadline.findById(deadline._id)
      .populate('createdBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/deadlines/:id — super auth only for full edit
router.put('/:id', auth, superAuthOnly, async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email');
    if (!deadline) return res.status(404).json({ error: 'Deadline not found' });
    res.json(deadline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/deadlines/:id/complete — both org head + super auth
router.patch('/:id/complete', auth, authOrOrgHead, async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date(), completedBy: req.user._id },
      { new: true }
    ).populate('createdBy', 'name email').populate('completedBy', 'name email');
    if (!deadline) return res.status(404).json({ error: 'Deadline not found' });
    res.json(deadline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/deadlines/:id/reopen — super auth only
router.patch('/:id/reopen', auth, superAuthOnly, async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndUpdate(
      req.params.id,
      { status: 'pending', completedAt: null, completedBy: null },
      { new: true }
    ).populate('createdBy', 'name email');
    if (!deadline) return res.status(404).json({ error: 'Deadline not found' });
    res.json(deadline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/deadlines/:id — super auth only
router.delete('/:id', auth, superAuthOnly, async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndDelete(req.params.id);
    if (!deadline) return res.status(404).json({ error: 'Deadline not found' });
    res.json({ message: 'Deadline removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
