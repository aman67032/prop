const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, default: '' },
  gender: { type: String, default: '' },
  position: { type: String, required: true },
  committee: { type: String, required: true },
  cluster: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  category: {
    type: String,
    enum: ['organizing_head', 'committee_head', 'team_leader', 'volunteer', 'cluster_head', 'cohort_leader'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
