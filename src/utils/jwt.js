// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// exports.sign = (payload) => {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// };

// exports.verify = (token) => {
//   return jwt.verify(token, JWT_SECRET);
// };


const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
