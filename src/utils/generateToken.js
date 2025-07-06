const { v4: uuidv4 } = require('uuid');

function generateRecoveryToken() {
  const token = uuidv4(); // genera un token único y aleatorio
  const expiresIn = process.env.TOKEN_EXPIRES_IN || 3600; // en segundos (por defecto: 1 hora)
  
  const expiresAt = new Date(Date.now() + expiresIn * 1000); // convierte segundos a milisegundos

  return { token, expiresAt };
}

module.exports = generateRecoveryToken;
