const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: "Acceso denegado" });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), '4354l');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido" });
    }
};