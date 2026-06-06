const express = require('express');
const cors = require('cors');
const app = express();

// Importaciones
const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const authMiddleware = require('../middleware/auth'); // Asegúrate que esta ruta sea la correcta

// 1. Middlewares globales (SIEMPRE van arriba)
app.use(cors());
app.use(express.json());

// 2. Rutas públicas (No requieren login)
app.use('/api/auth', authRoutes);

// 3. Rutas protegidas (Requieren el token)
app.use('/api/players', authMiddleware, playerRoutes); 

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor seguro corriendo en el puerto ${PORT}`));