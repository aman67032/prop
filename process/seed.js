require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const TeamMember = require('./models/TeamMember');
const Deadline = require('./models/Deadline');

function categorize(position) {
  const p = (position || '').toLowerCase();
  if (p.includes('organizing head')) return 'organizing_head';
  if (p.includes('team leader')) return 'team_leader';
  if (p.includes('cluster head')) return 'cluster_head';
  if (p.includes('cohort leader')) return 'cohort_leader';
  if (p.includes('volunteer')) return 'volunteer';
  return 'volunteer';
}

function getCommittee(position) {
  const p = (position || '');
  if (p.includes('Organizing Head')) return 'Organizing Committee';
  const match = p.match(/^(.+?)\s*[-–]\s*(Team Leader|Volunteer|Committee)/i);
  if (match) return match[1].trim();
  if (p.includes('Cluster Head') || p.includes('Cohort Leader')) return 'Clusters';
  return p;
}

const teamData = [
  // Organizing Heads
  { name: 'Vedika Agrawal', rollNo: '2023BTech096', gender: 'Female', position: 'Organizing Head', phone: '9772219303', email: 'vedikaagrawal@jklu.edu.in' },
  { name: 'Aman Pratap Singh', rollNo: '2024BTech136', gender: 'Male', position: 'Organizing Head', phone: '9456608637', email: 'amanpratapsingh@jklu.edu.in' },
  { name: 'Vaishnavi Shukla', rollNo: '2024BTech143', gender: 'Female', position: 'Organizing Head', phone: '8769276288', email: 'vaishnavishukla@jklu.edu.in' },
  { name: 'Tanik Gupta', rollNo: '2024btech234', gender: 'Male', position: 'Organizing Head', phone: '9929396663', email: 'tanikgupta@jklu.edu.in' },
  { name: 'Ambika Dalmia', rollNo: '2024bdes002', gender: 'Female', position: 'Organizing Head', phone: '9679220337', email: 'ambikadalmia@jklu.edu.in' },
  // Discipline Committee
  { name: 'Kartik Sharma', rollNo: '2024BTech092', gender: 'Male', position: 'Discipline Committee - Team Leader', phone: '8769329369', email: 'kartiksharma2024@jklu.edu.in' },
  { name: 'Pratigya Bomb', rollNo: '2024btech140', gender: 'Female', position: 'Discipline Committee - Team Leader', phone: '6264667506', email: 'pratigyabomb@jklu.edu.in' },
  // Internal Arrangements
  { name: 'Naman Shukla', rollNo: '2024BBA054', gender: 'Male', position: 'Internal Arrangements Committee - Team Leader', phone: '9929727849', email: 'namanshukla@jklu.edu.in' },
  { name: 'Mayank Gautam', rollNo: '2024Btech001', gender: 'Male', position: 'Internal Arrangements Committee - Team Leader', phone: '8949349516', email: 'mayank@jklu.edu.in' },
  { name: 'Anoushka Singh', rollNo: '2025bdes006', gender: 'Female', position: 'Internal Arrangements Committee - Volunteer', phone: '8949038616', email: 'Anoushkasingh@Jklu.Edu.In' },
  { name: 'Ghyan Chechani', rollNo: '2025Btech304', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '8824600720', email: 'Ghyanchechani@Jklu.Edu.In' },
  { name: 'Pari Maloo', rollNo: '2025bba081', gender: 'Female', position: 'Internal Arrangements Committee - Volunteer', phone: '9351313345', email: 'Parimaloo@Jklu.Edu.In' },
  { name: 'Hardik Kumawat', rollNo: '2025BBA046', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '9001023997', email: 'Hardikkumawat@Jklu.Edu.In' },
  { name: 'Harshvardhan Singh', rollNo: '2025btech141', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '7568434676', email: 'Harshvardhansingh@Jklu.Edu.In' },
  { name: 'Jitendra', rollNo: '2025bba051', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '9653840559', email: 'Jitendra@Jklu.Edu.In' },
  { name: 'Lakshya Gupta', rollNo: '2025btech203', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '7597370438', email: 'Lakshyagupta@Jklu.Edu.In' },
  { name: 'Priyanshu Kumar', rollNo: '2025btech271', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '9891660352', email: 'Priyanshukumar2025@Jklu.Edu.In' },
  { name: 'Raghav Sharma', rollNo: '2025btech099', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '7849902293', email: 'Raghavsharma2025@Jklu.Edu.In' },
  { name: 'Raghuraj Jangid', rollNo: '2025btech100', gender: 'Male', position: 'Internal Arrangements Committee - Volunteer', phone: '8306203348', email: 'Raghurajjangid@Jklu.Edu.In' },
  { name: 'Sanchi Dhoopia', rollNo: '2025btech338', gender: 'Female', position: 'Internal Arrangements Committee - Volunteer', phone: '9664356901', email: 'Sanchidhoopia@Jklu.Edu.In' },
  { name: 'Shreshtha Sharma', rollNo: '2025BBA106', gender: 'Female', position: 'Internal Arrangements Committee - Volunteer', phone: '9660599045', email: 'Shreshthasharma@Jklu.Edu.In' },
  // Event & Venue
  { name: 'Parth Bhardwaj', rollNo: '2024BBA059', gender: 'Male', position: 'Event & Venue Committee - Team Leader', phone: '7850993545', email: 'parthbhardwaj@jklu.edu.in' },
  { name: 'Shlok Chaturvedi', rollNo: '2024btech010', gender: 'Male', position: 'Event & Venue Committee - Team Leader', phone: '7737257861', email: 'shlokchaturvedi@jklu.edu.in' },
  // Photography
  { name: 'Parth Mahadeshwar', rollNo: '2024BBA060', gender: 'Male', position: 'Photography Committee - Team Leader', phone: '7827968227', email: 'parthmahadeshwar@jklu.edu.in' },
  { name: 'Paritosh Jain', rollNo: '2024btech144', gender: 'Male', position: 'Photography Committee - Team Leader', phone: '9521556662', email: 'paritoshjain@jklu.edu.in' },
  // Social Media
  { name: 'Mehul Agrawal', rollNo: '2024bdes023', gender: 'Male', position: 'Social Media Committee - Team Leader', phone: '9829076310', email: 'mehulagrawal@jklu.edu.in' },
  { name: 'Tanisha Agrawal', rollNo: '2024bdes028', gender: 'Female', position: 'Social Media Committee - Team Leader', phone: '9079701011', email: 'tanishaagrawal@jklu.edu.in' },
  // Media
  { name: 'Devansh Soni', rollNo: '2024Btech090', gender: 'Male', position: 'Media Committee - Team Leader', phone: '7014740084', email: 'devanshsoni@jklu.edu.in' },
  { name: 'Ishaan Lunawat', rollNo: '2024BBA035', gender: 'Male', position: 'Media Committee - Team Leader', phone: '8890004244', email: 'ishaanlunawat@jklu.edu.in' },
  // Hospitality
  { name: 'Arjun Kumar', rollNo: '2024btech070', gender: 'Male', position: 'Hospitality Committee - Team Leader', phone: '9302652442', email: 'arjunkumar@jklu.edu.in' },
  { name: 'Sejal Jain', rollNo: '2024bba076', gender: 'Female', position: 'Hospitality Committee - Team Leader', phone: '8905559975', email: 'sejaljain@jklu.edu.in' },
  // Design
  { name: 'Anshul Vyas', rollNo: '2024bdes006', gender: 'Male', position: 'Design Committee - Team Leader', phone: '7742444447', email: 'anshulvyas@jklu.edu.in' },
  // Technical
  { name: 'Shivangi Kaushal', rollNo: '2024btech177', gender: 'Female', position: 'Technical Committee - Team Leader', phone: '7900262663', email: 'shivangikaushal@jklu.edu.in' },
  { name: 'Krish Jain', rollNo: '2024btech097', gender: 'Male', position: 'Technical Committee - Team Leader', phone: '7568014457', email: 'krishjain@jklu.edu.in' },
  // Food & Accommodation
  { name: 'Riya Agrawal', rollNo: '2024bba067', gender: 'Female', position: 'Food & Accommodation Committee - Team Leader', phone: '9799944405', email: 'riyaagrawal2024@jklu.edu.in' },
  { name: 'Tushar Bansal', rollNo: '2024btech012', gender: 'Male', position: 'Food & Accommodation Committee - Team Leader', phone: '8302800005', email: 'tusharbansal@jklu.edu.in' },
  { name: 'Khelan Jain', rollNo: '2024btech193', gender: 'Male', position: 'Food & Accommodation Committee - Team Leader', phone: '8619093936', email: 'khelanjain@jklu.edu.in' },
  // Feedback & Registration
  { name: 'Siddhi Gupta', rollNo: '2024bba080', gender: 'Female', position: 'Feedback & Registration Committee - Team Leader', phone: '9636363632', email: 'siddhigupta@jklu.edu.in' },
  // Cluster Heads
  { name: 'Rishika Singh', rollNo: '2024btech168', gender: 'Female', position: 'Cluster Head', phone: '7300118679', email: 'rishikasingh2024@jklu.edu.in', cluster: 'Cluster A' },
  { name: 'Swadha Saxena', rollNo: '2024BBA086', gender: 'Female', position: 'Cluster Head', phone: '9079707725', email: 'swadhasaxena@jklu.edu.in', cluster: 'Cluster B' },
  { name: 'Vidhi Chamaria', rollNo: '2024bdes035', gender: 'Female', position: 'Cluster Head', phone: '9829883263', email: 'vidhichamaria@jklu.edu.in', cluster: 'Cluster C' },
  { name: 'Daksh Kumar', rollNo: '2024btech031', gender: 'Male', position: 'Cluster Head', phone: '8949291337', email: 'DakshKumar@jklu.edu.in', cluster: 'Cluster D' },
  { name: 'Bhavya Bang', rollNo: '2024bdes009', gender: 'Male', position: 'Cluster Head', phone: '7023282838', email: 'Bhavya@jklu.edu.in', cluster: 'Cluster E' },
  { name: 'Khushi Soni', rollNo: '2024btech054', gender: 'Female', position: 'Cluster Head', phone: '9024877641', email: 'Khushisoni@jklu.edu.in', cluster: 'Cluster F' },
  { name: 'Aryan Gupta', rollNo: '2024btech036', gender: 'Male', position: 'Cluster Head', phone: '8302958564', email: 'aryangupta@jklu.edu.in', cluster: 'Cluster G' },
  { name: 'Rishika Sharma', rollNo: '2024bba072', gender: 'Female', position: 'Cluster Head', phone: '9929175875', email: 'rishikasharma@jklu.edu.in', cluster: 'Cluster H' },
  { name: 'Vankayala Pavani', rollNo: '2024btech171', gender: 'Female', position: 'Cluster Head', phone: '7842114595', email: 'vankayalapavani@jklu.edu.in', cluster: 'Cluster I' },
  { name: 'Varra Srivalli', rollNo: '2024Btech261', gender: 'Female', position: 'Cluster Head', phone: '9502303519', email: 'Varrasrivalli@jklu.edu.in', cluster: 'Cluster J' },
  { name: 'Doddapuneni Jahanavi', rollNo: '2024btech040', gender: 'Female', position: 'Cluster Head', phone: '9515934329', email: 'doddapunenijahanavi@jklu.edu.in', cluster: 'Cluster K' },
  { name: 'Kanedela Nandani', rollNo: '2024btech204', gender: 'Female', position: 'Cluster Head', phone: '9391774008', email: 'kanedelanandini@jklu.edu.in', cluster: 'Cluster L' },
];

const deadlineData = [
  { title: 'Event Theme Finalization', description: 'Finalize the overall theme for Aarambh 2026', date: '2026-05-20', committee: 'Organizing Committee', priority: 'critical' },
  { title: 'Venue Booking Confirmation', description: 'Confirm all venue bookings for main events', date: '2026-05-22', committee: 'Event & Venue Committee', priority: 'critical' },
  { title: 'Social Media Campaign Launch', description: 'Launch pre-event social media campaigns', date: '2026-05-21', committee: 'Social Media Committee', priority: 'high' },
  { title: 'Volunteer Orientation Schedule', description: 'Schedule orientation sessions for all volunteers', date: '2026-05-23', committee: 'Internal Arrangements Committee', priority: 'high' },
  { title: 'Photography Equipment Check', description: 'Verify all photography and videography equipment', date: '2026-05-24', committee: 'Photography Committee', priority: 'medium' },
  { title: 'Food Vendor Contracts', description: 'Finalize contracts with all food vendors', date: '2026-05-25', committee: 'Food & Accommodation Committee', priority: 'high' },
  { title: 'Registration Portal Testing', description: 'Complete testing of the registration portal', date: '2026-05-21', committee: 'Feedback & Registration Committee', priority: 'critical' },
  { title: 'Design Assets for Print', description: 'Complete all design assets for print materials', date: '2026-05-23', committee: 'Design Committee', priority: 'high' },
  { title: 'Technical Infrastructure Setup', description: 'Set up all technical infrastructure for event', date: '2026-05-26', committee: 'Technical Committee', priority: 'critical' },
  { title: 'Media Coverage Plan', description: 'Finalize media coverage and press release plan', date: '2026-05-24', committee: 'Media Committee', priority: 'medium' },
  { title: 'Discipline Protocol Document', description: 'Prepare discipline and safety protocols', date: '2026-05-22', committee: 'Discipline Committee', priority: 'high' },
  { title: 'Hospitality Kit Preparation', description: 'Prepare welcome kits for guests and participants', date: '2026-05-27', committee: 'Hospitality Committee', priority: 'medium' },
  { title: 'Cohort Leader Briefing', description: 'Brief all cohort leaders on their responsibilities', date: '2026-05-23', committee: 'Clusters', priority: 'high' },
  { title: 'Accommodation Allocation', description: 'Finalize accommodation allocation for outstation guests', date: '2026-05-26', committee: 'Food & Accommodation Committee', priority: 'high' },
  { title: 'Event Day Schedule', description: 'Finalize minute-by-minute event day schedule', date: '2026-05-28', committee: 'Event & Venue Committee', priority: 'critical' },
  { title: 'Budget Report Submission', description: 'Submit final budget reports to OSA', date: '2026-05-19', committee: 'Organizing Committee', priority: 'critical', status: 'completed' },
  { title: 'Sponsor Deliverables', description: 'Complete all sponsor visibility deliverables', date: '2026-05-25', committee: 'Media Committee', priority: 'high' },
  { title: 'Emergency Response Plan', description: 'Prepare emergency response and first aid plan', date: '2026-05-20', committee: 'Discipline Committee', priority: 'critical' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await TeamMember.deleteMany({});
    await Deadline.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const superUser = await User.create({
      name: 'Aman Pratap Singh',
      email: 'amanpratapsingh@jklu.edu.in',
      password: 'admin123',
      role: 'super_auth'
    });

    await User.create({
      name: 'Vedika Agrawal',
      email: 'vedikaagrawal@jklu.edu.in',
      password: 'orghead123',
      role: 'organizing_head'
    });

    await User.create({
      name: 'Tanik Gupta',
      email: 'tanikgupta@jklu.edu.in',
      password: 'orghead123',
      role: 'organizing_head'
    });

    console.log('Users created');

    // Create team members
    const members = teamData.map(m => ({
      ...m,
      committee: m.cluster || getCommittee(m.position),
      category: categorize(m.position),
      cluster: m.cluster || ''
    }));

    await TeamMember.insertMany(members);
    console.log(`${members.length} team members created`);

    // Create deadlines
    const deadlines = deadlineData.map(d => ({
      ...d,
      date: new Date(d.date),
      createdBy: superUser._id,
      status: d.status || 'pending',
      completedAt: d.status === 'completed' ? new Date() : null
    }));

    await Deadline.insertMany(deadlines);
    console.log(`${deadlines.length} deadlines created`);

    console.log('\n--- Login Credentials ---');
    console.log('Super Auth: amanpratapsingh@jklu.edu.in / admin123');
    console.log('Org Head: vedikaagrawal@jklu.edu.in / orghead123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
