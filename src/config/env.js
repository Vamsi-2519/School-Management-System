// env validation and defaults
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  port: process.env.PORT || 3000,
  masterDbUrl: process.env.MASTER_DB_URL,
  redisUrl: process.env.REDIS_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  }
};
