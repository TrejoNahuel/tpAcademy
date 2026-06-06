const User = require('./models/user');

async function createAdmin() {
    await User.sync(); // Esto crea la tabla si no existe
    await User.create({
        username: 'nahuel',
        password: '4354l' // El hook se encargará de encriptarla
    });
    console.log('Usuario admin creado');
}

createAdmin();