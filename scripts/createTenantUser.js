const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('school_GPS_01', 'postgres', 'Vamsi143@', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('ADMIN', 'TEACHER', 'STAFF'), allowNull: false }
}, { freezeTableName: true, timestamps: true });

async function createUser() {
  await sequelize.sync();
  const hashedPassword = await bcrypt.hash('123456', 10); // Password as per login body
  await User.create({
    email: 'gps12346@gmail.com',
    phone: '9999999999',
    password: hashedPassword,
    role: 'ADMIN'
  });
  console.log('User created!');
  // Print all users for verification
  const allUsers = await User.findAll();
  console.log('All users in DB:', allUsers.map(u => ({ email: u.email, phone: u.phone, role: u.role })));
  await sequelize.close();
}

createUser();
