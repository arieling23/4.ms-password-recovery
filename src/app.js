require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recoveryRoutes = require('./routes/recoveryRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3004; 


connectDB();


const corsOptions = {
  origin: 'http://54.225.75.133:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(express.json());


app.use('/recovery', recoveryRoutes);


app.get('/', (req, res) => {
  res.send('✅ Microservicio de recuperación de contraseña activo');
});


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
  console.log(`🚀 ms-password-recovery escuchando en puerto ${PORT}`);
});

module.exports = app;
