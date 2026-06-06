const Player = require('../models/player');
const { Op } = require('sequelize'); // 🟢 ESTO ES VITAL PARA BUSCAR POR TEXTO

// 1. Obtener Jugadores con Filtros Combinados
exports.getPlayers = async (req, res) => {
    try {
        const { country, year, gender, name, club } = req.query;
        let filterConditions = {};

       // Filtros exactos
        if (country) filterConditions.nationality_name = country;
        if (year) filterConditions.fifa_version = year;
        if (gender) filterConditions.gender = gender;
        
        //Filtros de PALABRA EXACTA usando Expresiones Regulares
        if (name) filterConditions.long_name = { [Op.regexp]: `\\b${name}\\b` };
        if (club) filterConditions.club_name = { [Op.regexp]: `\\b${club}\\b` };

        const players = await Player.findAll({ 
            where: filterConditions,
            order: [['id', 'DESC']], 
            limit: 100 
        });
        
        res.status(200).json({ players });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Crear Jugador
exports.createPlayer = async (req, res) => {
    try {
        const newPlayer = await Player.create(req.body);
        res.status(201).json({ message: "¡Jugador creado exitosamente!", player: newPlayer });
    } catch (error) {
        console.error("💥 ERROR AL INSERTAR EN LA DB:", error); 
        res.status(500).json({ error: error.message });
    }
};

// 3. Listas Dinámicas para los Desplegables del Frontend
exports.getNationalities = async (req, res) => {
    try {
        const nationalities = await Player.findAll({
            attributes: ['nationality_name'], group: ['nationality_name'],
            where: { nationality_name: { [Op.not]: null } }, order: [['nationality_name', 'ASC']]
        });
        res.status(200).json({ nationalities: nationalities.map(n => n.nationality_name) });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getClubs = async (req, res) => {
    try {
        const clubs = await Player.findAll({
            attributes: ['club_name'], group: ['club_name'],
            where: { club_name: { [Op.not]: null } }, order: [['club_name', 'ASC']]
        });
        res.status(200).json({ clubs: clubs.map(c => c.club_name) });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getVersions = async (req, res) => {
    try {
        const versions = await Player.findAll({
            attributes: ['fifa_version'], group: ['fifa_version'],
            where: { fifa_version: { [Op.not]: null } }, order: [['fifa_version', 'DESC']]
        });
        res.status(200).json({ versions: versions.map(v => v.fifa_version) });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
// 4. Obtener un solo jugador por ID
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.id);
        if (!player) return res.status(404).json({ message: "Jugador no encontrado" });
        res.status(200).json({ player });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.id);
        if (!player) return res.status(404).json({ message: "Jugador no encontrado" });

        await player.update(req.body);
        res.status(200).json({ message: "Jugador actualizado exitosamente", player });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};