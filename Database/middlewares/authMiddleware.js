const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Không có token, truy cập bị từ chối!' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ!' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền truy cập!' });
  }
  next();
};

exports.isCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Bạn không có quyền truy cập!' });
  }
  next();
};
