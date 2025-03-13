// Claims CRUD routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Claim = require('../models/Claim');
const authMiddleware = require('../middleware/authMiddleware');

// Setup multer for file uploads (files will be stored in server/uploads folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure the folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Submit a new claim (for patients)
router.post('/', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { name, email, claimAmount, description } = req.body;
    const newClaim = new Claim({
      name,
      email,
      claimAmount,
      description,
      document: req.file ? req.file.path : null
    });
    const savedClaim = await newClaim.save();
    res.json(savedClaim);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get claims (patients see only their claims, insurers see all)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      if (req.query.email) {
        query.email = req.query.email;
      }
    } else if (req.user.role === 'insurer') {
      if (req.query.status) query.status = req.query.status;
    }
    const claims = await Claim.find(query).sort({ submissionDate: -1 });
    res.json(claims);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a claim (for insurers)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'insurer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const { status, approvedAmount, insurerComments } = req.body;
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ msg: 'Claim not found' });
    }
    claim.status = status || claim.status;
    claim.approvedAmount = approvedAmount;
    claim.insurerComments = insurerComments;
    await claim.save();
    res.json(claim);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
