const jwt = require('jsonwebtoken');

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Non authentifié" });

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Vérifier si le rôle de l'utilisateur est autorisé
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Accès interdit : privilèges insuffisants" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token invalide" });
    }
  };
};