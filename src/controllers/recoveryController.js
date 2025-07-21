const Token = require('../models/Token');
const generateRecoveryToken = require('../utils/generateToken');
const recoveryService = require('../services/recoveryService');
const publisher = require('../events/publisher');


const requestRecoveryToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
  return res.status(400).json({ error: 'Email es requerido' });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: 'Formato de email no válido' });
}

  try {
    
    const { token, expiresAt } = generateRecoveryToken();
   
    await Token.deleteMany({ email });


  
    await Token.create({ email, token, expiresAt });

    
    await publisher.publish('password.recovery.requested', { email, token });

    res.status(200).json({ message: 'Token de recuperación generado y enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar token de recuperación' });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
  }

  try {
    
    const result = await recoveryService.resetPasswordWithToken(token, newPassword);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    
    await publisher.publish('password.recovery.completed', { email: result.email });

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};

module.exports = {
  requestRecoveryToken,
  resetPassword
};
