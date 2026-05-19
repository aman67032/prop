require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const deadlineRoutes = require('./routes/deadlines');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/deadlines', deadlineRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
