const Token = require('../models/Token');
const generateRecoveryToken = require('../utils/generateToken');
const recoveryService = require('../services/recoveryService');
const publisher = require('../events/publisher');

// Solicitud de recuperación de contraseña
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
    // Generar token
    const { token, expiresAt } = generateRecoveryToken();
    // Eliminar tokens anteriores del mismo usuario
    await Token.deleteMany({ email });


    // Guardar token en la base de datos
    await Token.create({ email, token, expiresAt });

    // Publicar evento para enviar correo (a ms-notifications)
    await publisher.publish('password.recovery.requested', { email, token });

    res.status(200).json({ message: 'Token de recuperación generado y enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar token de recuperación' });
  }
};

// Resetear la contraseña con el token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
  }

  try {
    // Validar token y cambiar contraseña
    const result = await recoveryService.resetPasswordWithToken(token, newPassword);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Publicar evento de contraseña restablecida
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
