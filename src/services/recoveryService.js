const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const axios = require('axios');

const resetPasswordWithToken = async (token, newPassword) => {
  try {
    // Buscar el token en la base de datos
    const tokenDoc = await Token.findOne({ token });

    if (!tokenDoc) {
      return { success: false, message: 'Token inválido' };
    }

    if (tokenDoc.expiresAt < new Date()) {
   await Token.deleteOne({ token }); // limpieza automática
    return { success: false, message: 'Token expirado' };
}


    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Llamar a otro microservicio (por ejemplo: ms-user-profile) para actualizar contraseña
    await axios.put(`${process.env.USER_SERVICE_URL}/update-password`, {
      email: tokenDoc.email,
      newPassword
    });

    // Eliminar token ya utilizado
    await Token.deleteOne({ token });

    return { success: true, email: tokenDoc.email };
  } catch (err) {
    console.error('Error en resetPasswordWithToken:', err);
    return { success: false, message: 'Error interno del servidor' };
  }
};

module.exports = {
  resetPasswordWithToken
};
