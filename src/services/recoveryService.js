const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const axios = require('axios');

const resetPasswordWithToken = async (token, newPassword) => {
  try {
    
    const tokenDoc = await Token.findOne({ token });

    if (!tokenDoc) {
      return { success: false, message: 'Token inválido' };
    }

    if (tokenDoc.expiresAt < new Date()) {
   await Token.deleteOne({ token }); 
    return { success: false, message: 'Token expirado' };
}


    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await axios.put(`${process.env.USER_SERVICE_URL}/update-password`, {
      email: tokenDoc.email,
      newPassword
    });

    
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
