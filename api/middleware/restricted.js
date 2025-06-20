const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("token required");
  }

  jwt.verify(token, process.env.SECRET || "shh", (err, decoded) => {
    if (err) {
      return res.status(401).json("token invalid");
    }
    // Podrías guardar info del token decodificado en req para uso futuro
    req.decodedJwt = decoded;
    next();
  });
};

