const jwt = require('jsonwebtoken');

// Función para generar un token JWT
function generarToken(userId, role) {
    const token = jwt.sign({ userId: userId, role: role }, 'secreto', { expiresIn: '1h' });
    return token;
}



module.exports = { generarToken };
