const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const m = await TeamMember.find({ name: /Rishika|Swadha/i });
  console.log(m.map(x => x.name + ' - ' + x.committee + ' - ' + x.position));
  process.exit(0);
});
