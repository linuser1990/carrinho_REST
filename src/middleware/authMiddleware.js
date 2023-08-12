// authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'secreto';

module.exports = (req, res, next) => {
  const token = req.query.token;

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
      next();
    });
  }
  // Não há redirecionamento aqui, independentemente de estar autenticado ou não
  next();
};
