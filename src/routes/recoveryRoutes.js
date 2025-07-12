const express = require('express');
const router = express.Router();
const {
  requestRecoveryToken,
  resetPassword
} = require('../controllers/recoveryController');

// Ruta para solicitar recuperación de contraseña

router.post('/request', requestRecoveryToken);

// Ruta para restablecer contraseña con token

router.post('/reset', resetPassword);

module.exports = router;
