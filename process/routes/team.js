const express = require('express');
const TeamMember = require('../models/TeamMember');
const { auth, superAuthOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/team — public
router.get('/', async (req, res) => {
  try {
    const { committee, category, search } = req.query;
    const filter = {};
    if (committee) filter.committee = { $regex: committee, $options: 'i' };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await TeamMember.find(filter).sort({ category: 1, committee: 1, name: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/team/stats — public
router.get('/stats', async (req, res) => {
  try {
    const total = await TeamMember.countDocuments();
    const byCategory = await TeamMember.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const byCommittee = await TeamMember.aggregate([
      { $group: { _id: '$committee', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const byGender = await TeamMember.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    res.json({ total, byCategory, byCommittee, byGender });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/team/structure — public (hierarchical)
router.get('/structure', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ category: 1, committee: 1, name: 1 });

    // Group into hierarchy
    const orgHeads = members.filter(m => m.category === 'organizing_head');
    const committees = {};

    members.forEach(m => {
      if (m.category !== 'organizing_head') {
        const key = m.committee;
        if (!committees[key]) {
          committees[key] = { name: key, heads: [], volunteers: [], clusterHeads: [], cohortLeaders: [] };
        }
        if (m.category === 'team_leader' || m.category === 'committee_head') {
          committees[key].heads.push(m);
        } else if (m.category === 'volunteer') {
          committees[key].volunteers.push(m);
        } else if (m.category === 'cluster_head') {
          committees[key].clusterHeads.push(m);
        } else if (m.category === 'cohort_leader') {
          committees[key].cohortLeaders.push(m);
        }
      }
    });

    res.json({ organizingHeads: orgHeads, committees: Object.values(committees) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/team — super auth only
router.post('/', auth, superAuthOnly, async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/team/:id — super auth only
router.put('/:id', auth, superAuthOnly, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/team/:id — super auth only
router.delete('/:id', auth, superAuthOnly, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
