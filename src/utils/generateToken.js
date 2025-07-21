const { v4: uuidv4 } = require('uuid');

function generateRecoveryToken() {
  const token = uuidv4(); 
  const expiresIn = process.env.TOKEN_EXPIRES_IN || 3600; 
  
  const expiresAt = new Date(Date.now() + expiresIn * 1000); 

  return { token, expiresAt };
}

module.exports = generateRecoveryToken;
