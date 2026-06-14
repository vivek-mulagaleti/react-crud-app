const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Authorization token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaches decoded payload containing the user ID to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid token validation.' });
  }
};

module.exports = protect;