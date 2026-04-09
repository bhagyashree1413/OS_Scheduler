const { body, validationResult } = require('express-validator');
const scheduler = require('../utils/scheduler');

exports.validate = () => [
  body('algorithms').isArray({ min: 1 }),
  body('algorithms.*').isIn(['FCFS','SJF','RR']),
  body('processes').isArray({ min: 1 }),
  body('processes.*.pid').exists(),
  body('processes.*.arrival').isNumeric(),
  body('processes.*.burst').isNumeric(),
];

exports.run = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { algorithms, processes, quantum } = req.body;
  try {
    const results = {};
    for (const alg of algorithms) {
      results[alg] = scheduler.run({ algorithm: alg, processes, quantum });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
