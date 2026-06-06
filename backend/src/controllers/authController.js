const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Generamos el token (usando una palabra clave secreta)
        const token = jwt.sign({ id: user.id }, '4354l', { expiresIn: '2h' });
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Verificamos si el usuario ya existe
        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // 2. Creamos el usuario (Recuerda que tu modelo User ya tiene el hook que encripta la contraseña)
        await User.create({ username, password });
        
        res.status(201).json({ message: "Usuario creado exitosamente. Ya puedes iniciar sesión." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};