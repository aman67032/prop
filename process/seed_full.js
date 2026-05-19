require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const User = require('./models/User');
const TeamMember = require('./models/TeamMember');
const Deadline = require('./models/Deadline');

function categorize(position) {
  const p = (position || '').toLowerCase();
  if (p.includes('organizing head')) return 'organizing_head';
  if (p.includes('team leader')) return 'team_leader';
  if (p.includes('committee head')) return 'committee_head';
  if (p.includes('cluster head')) return 'cluster_head';
  if (p.includes('cohort leader')) return 'cohort_leader';
  if (p.includes('volunteer')) return 'volunteer';
  return 'volunteer';
}

function getCommittee(position) {
  const p = (position || '');
  if (p.includes('Organizing Head')) return 'Organizing Committee';
  const match = p.match(/^(.+?)\s*[-–]\s*(Team Leader|Volunteer|Committee|Head)/i);
  if (match) return match[1].trim();
  if (p.includes('Cluster Head') || p.includes('Cohort Leader')) return 'Clusters';
  return p;
}

const deadlineData = [
  { title: "Theme, logo and brand guide locked", date: "2026-05-20", committee: "Design Committee", priority: "critical" },
  { title: "OH meeting done", date: "2026-05-25", committee: "Organizing Committee", priority: "high" },
  { title: "Photography archive done", date: "2026-05-25", committee: "Photography Team", priority: "high" },
  { title: "Social Media calendar approved", date: "2026-05-25", committee: "Social Media Team", priority: "high" },
  { title: "Website draft ready", date: "2026-05-28", committee: "Tech Team", priority: "high" },
  { title: "Website content to Tech", date: "2026-05-28", committee: "Media Team", priority: "high" },
  { title: "Web assets to Tech", date: "2026-05-28", committee: "Design Committee", priority: "high" },
  { title: "Poster first drafts submitted", date: "2026-06-03", committee: "Design Committee", priority: "medium" },
  { title: "Website deployed", date: "2026-06-05", committee: "Tech Team", priority: "high" },
  { title: "Event and guest content done", date: "2026-06-05", committee: "Media Team", priority: "high" },
  { title: "All posters final", date: "2026-06-09", committee: "Design Committee", priority: "critical" },
  { title: "Website live, check-in live, volunteer portal live", date: "2026-06-10", committee: "Tech Team", priority: "critical" },
  { title: "Registrations open", date: "2026-06-10", committee: "Tech Team", priority: "critical" },
  { title: "Reg post + bio updated", date: "2026-06-10", committee: "Social Media Team", priority: "high" },
  { title: "Brochure done", date: "2026-06-10", committee: "Design Committee", priority: "high" },
  { title: "Feedback portal live", date: "2026-06-15", committee: "Tech Team", priority: "high" },
  { title: "Power and connectivity list submitted", date: "2026-06-15", committee: "Internal Arrangements", priority: "high" },
  { title: "Gear list submitted", date: "2026-06-15", committee: "Photography Team", priority: "high" },
  { title: "First drafts of ID cards, certs and t-shirts", date: "2026-06-18", committee: "Design Committee", priority: "medium" },
  { title: "Standees, banners and backdrop final", date: "2026-06-19", committee: "Design Committee", priority: "high" },
  { title: "Equipment list submitted", date: "2026-06-20", committee: "Tech Team", priority: "high" },
  { title: "Operational walkthrough done", date: "2026-06-20", committee: "Hospitality Team", priority: "high" },
  { title: "ID cards and certs revision deadline", date: "2026-06-23", committee: "Design Committee", priority: "high" },
  { title: "All ID cards, certs and apparel absolutely final", date: "2026-06-26", committee: "Design Committee", priority: "critical" },
  { title: "10-15 posts published in total", date: "2026-06-28", committee: "Social Media Team", priority: "high" },
  { title: "Protocols doc to OHs", date: "2026-07-01", committee: "Discipline Team", priority: "high" },
  { title: "Photo Finder testing starts", date: "2026-07-01", committee: "Tech Team", priority: "medium" },
  { title: "Venue map to all teams", date: "2026-07-05", committee: "Internal Arrangements", priority: "critical" },
  { title: "Pre-event prep done", date: "2026-07-05", committee: "Media Team", priority: "high" },
  { title: "Photo Finder live", date: "2026-07-05", committee: "Tech Team", priority: "high" },
  { title: "Final briefing done", date: "2026-07-05", committee: "Hospitality Team", priority: "high" },
  { title: "Duty sheets ready, check-in training done", date: "2026-07-10", committee: "All Teams", priority: "critical" },
  { title: "Day 0: setup, checklists, briefings, test runs", date: "2026-07-11", committee: "All Teams", priority: "critical" },
  { title: "Fully on ground", date: "2026-07-12", committee: "Hospitality Team", priority: "critical" },
  { title: "AARAMBH - daily reports, incident logs", date: "2026-07-13", committee: "All Teams", priority: "critical" },
  { title: "Closure: breakdown, equipment returned", date: "2026-07-21", committee: "All Teams", priority: "medium" },
  { title: "Recap reel live", date: "2026-07-26", committee: "Social Media Team", priority: "medium" },
  { title: "Final report submitted", date: "2026-07-26", committee: "Media Team", priority: "medium" },
  { title: "Aftermovie live", date: "2026-07-28", committee: "Media Team", priority: "medium" },
  { title: "All photos on shared drive", date: "2026-07-28", committee: "Photography Team", priority: "medium" },
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
      password: 'AA@6782@jklu@89#yhk',
      role: 'super_auth'
    });
    console.log('Created Super Admin:', superUser.email);

    // OHs will be created dynamically after team members are imported
    // Wait, since deadlines need createdBy, superUser is enough.
    // We will create OH accounts below after team members are saved.

    // Extract team from Excel
    const excelPath = path.join(__dirname, '..', 'Final Team Wise List.xlsx');
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const teamMembers = [];
    let currentCluster = '';

    // Start from row 2 (index 1) to skip header
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;
      
      // If row has only first col with "Cluster X", track it
      if (typeof row[0] === 'string' && row[0].startsWith('Cluster')) {
        currentCluster = row[0].trim();
        continue;
      }
      
      // Check if it's a committee header row
      if (typeof row[0] === 'string' && row[0].endsWith('Committee')) {
        currentCluster = '';
        continue;
      }
      
      // Data row: S.No., Name, Roll No., Gender, Position, Mobile, Mail
      if (row[1] && typeof row[1] === 'string') {
        const name = row[1].trim();
        const rollNo = (row[2] || '').toString().trim();
        const gender = (row[3] || '').toString().trim();
        const position = (row[4] || '').toString().trim();
        const phone = (row[5] || '').toString().trim();
        const email = (row[6] || '').toString().trim();
        
        const category = categorize(position);
        let committee = getCommittee(position);
        let cluster = currentCluster;
        
        // Refine committee assignment
        if (category === 'cluster_head' || category === 'cohort_leader') {
          committee = cluster || 'Clusters';
        }
        
        teamMembers.push({
          name, rollNo, gender, position, phone, email, category, committee, cluster
        });
      }
    }

    await TeamMember.insertMany(teamMembers);
    console.log(`${teamMembers.length} team members imported from Excel`);

    // Dynamically create OH accounts for all imported OHs except Super Admin
    const ohs = teamMembers.filter(m => m.category === 'organizing_head');
    for (const oh of ohs) {
      if (oh.email.toLowerCase() === 'amanpratapsingh@jklu.edu.in') continue;
      await User.create({
        name: oh.name,
        email: oh.email,
        password: 'Ahju@708@jkil@90##',
        role: 'organizing_head'
      });
      console.log('Created OH User:', oh.email);
    }

    // Create deadlines
    const deadlines = deadlineData.map(d => ({
      ...d,
      date: new Date(d.date),
      createdBy: superUser._id,
      status: 'pending',
      completedAt: null
    }));

    await Deadline.insertMany(deadlines);
    console.log(`${deadlines.length} deadlines created`);

    console.log('\n--- Seeding Complete ---');
    console.log('Super Auth: amanpratapsingh@jklu.edu.in / AA@6782@jklu@89#yhk');
    console.log('OH Auth (x4): [email] / Ahju@708@jkil@90##');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
