const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'fifa_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '4354l',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql', // o 'mariadb'
        logging: false
    }
);
