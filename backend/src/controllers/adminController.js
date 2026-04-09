const User = require('../models/User');
const Simulation = require('../models/Simulation');

exports.listUsers = async (req, res) => {
  const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
  res.json(users);
};

exports.exportUsers = async (req, res) => {
  const format = (req.query.format || 'json').toLowerCase();
  const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
  if (format === 'csv') {
    const headers = ['_id', 'username', 'email', 'role', 'createdAt'];
    const escape = v => typeof v === 'string' ? '"' + v.replace(/"/g, '""') + '"' : v;
    const rows = users.map(u => headers.map(h => escape(u[h] ?? '')).join(','));
    const csv = headers.join(',') + '\n' + rows.join('\n');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.type('text/csv').send(csv);
  } else {
    res.json(users);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Missing id' });
  await User.findByIdAndDelete(id);
  // remove user's simulations
  await Simulation.deleteMany({ user: id });
  res.json({ message: 'Deleted' });
};

exports.listSimulations = async (req, res) => {
  const sims = await Simulation.find().populate('user', 'username email role').sort({ createdAt: -1 }).lean();
  res.json(sims);
};

exports.exportSimulations = async (req, res) => {
  const format = (req.query.format || 'json').toLowerCase();
  const sims = await Simulation.find().populate('user', 'username email role').sort({ createdAt: -1 }).lean();
  if (format === 'csv') {
    const headers = ['_id', 'name', 'user', 'userEmail', 'algorithm', 'quantum', 'processCount', 'createdAt'];
    const escape = v => typeof v === 'string' ? '"' + v.replace(/"/g, '""') + '"' : v;
    const rows = sims.map(s => {
      const userName = s.user ? s.user.username : '';
      const userEmail = s.user ? s.user.email : '';
      return headers.map(h => {
        switch (h) {
          case 'user': return escape(userName);
          case 'userEmail': return escape(userEmail);
          case 'processCount': return s.processes ? s.processes.length : 0;
          default: return escape(s[h] ?? '');
        }
      }).join(',');
    });
    const csv = headers.join(',') + '\n' + rows.join('\n');
    res.setHeader('Content-Disposition', 'attachment; filename=simulations.csv');
    res.type('text/csv').send(csv);
  } else {
    res.json(sims);
  }
};

exports.deleteSimulation = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Missing id' });
  await Simulation.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};
