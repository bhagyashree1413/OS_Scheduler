const { body, validationResult } = require('express-validator');
const Simulation = require('../models/Simulation');

exports.validate = () => [
  body('name').isLength({ min: 1 }),
  body('algorithm').isIn(['FCFS', 'SJF', 'RR']),
  body('processes').isArray({ min: 1 }),
  body('processes.*.pid').exists(),
  body('processes.*.arrival').isNumeric(),
  body('processes.*.burst').isNumeric(),
];

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, algorithm, quantum, processes, result } = req.body;
    const sim = new Simulation({ user: req.user.id, name, algorithm, quantum, processes, result });
    await sim.save();
    res.json(sim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    // use .lean() for read-only queries to reduce Mongoose overhead
    const sims = await Simulation.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(sims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const sim = await Simulation.findOne({ _id: req.params.id, user: req.user.id }).lean();
    if (!sim) return res.status(404).json({ message: 'Not found' });
    res.json(sim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const sim = await Simulation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!sim) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
