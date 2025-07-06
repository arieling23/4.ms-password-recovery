require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recoveryRoutes = require('./routes/recoveryRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3004; // ✅ Declarar el puerto

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/recovery', recoveryRoutes);

// Ruta para comprobar que el microservicio está activo
app.get('/', (req, res) => {
  res.send('✅ Microservicio de recuperación de contraseña activo');
});

// Middleware para ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 ms-password-recovery escuchando en puerto ${PORT}`);
});

module.exports = app;
