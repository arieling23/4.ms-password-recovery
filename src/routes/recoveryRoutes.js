const express = require('express');
const router = express.Router();
const {
  requestRecoveryToken,
  resetPassword
} = require('../controllers/recoveryController');

// Ruta para solicitar recuperación de contraseña
// POST /api/recovery/request
router.post('/request', requestRecoveryToken);

// Ruta para restablecer contraseña con token
// POST /api/recovery/reset
router.post('/reset', resetPassword);

module.exports = router;
