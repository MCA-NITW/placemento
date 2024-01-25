const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// view CTC stats
router.get('/ctc', statsController.getCTCStats);

// view Company stats
router.get('/company', statsController.getCompanyStats);

// view Student stats
router.get('/student', statsController.getStudentStats);

module.exports = router;
