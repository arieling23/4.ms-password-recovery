const express = require('express');
const router = express.Router();
const {
  requestRecoveryToken,
  resetPassword
} = require('../controllers/recoveryController');



router.post('/request', requestRecoveryToken);


router.post('/reset', resetPassword);

module.exports = router;
