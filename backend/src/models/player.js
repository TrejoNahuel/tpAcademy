const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    long_name: { type: DataTypes.STRING, allowNull: false },
    nationality_name: { type: DataTypes.STRING },
    club_name: { type: DataTypes.STRING },
    player_positions: { type: DataTypes.STRING },
    overall: { type: DataTypes.INTEGER },
    pace: { type: DataTypes.INTEGER },
    shooting: { type: DataTypes.INTEGER },
    passing: { type: DataTypes.INTEGER },
    dribbling: { type: DataTypes.INTEGER }, // <-- Nueva
    defending: { type: DataTypes.INTEGER }, // <-- Nueva
    physic: { type: DataTypes.INTEGER },    // <-- Nueva
    player_face_url: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    fifa_version: { type: DataTypes.STRING }
}, {
    tableName: 'players', 
    timestamps: false     
});

module.exports = Player;