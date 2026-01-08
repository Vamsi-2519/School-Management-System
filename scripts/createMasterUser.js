require('dotenv').config();
const MasterUser = require('../src/model/master/Masteruser');
const masterSequelize = require('../src/config/masterDb');

async function createUser() {
  const name = process.env.CREATE_NAME || process.argv[2];
  const email = process.env.CREATE_EMAIL || process.argv[3];
  const password = process.env.CREATE_PASSWORD || process.argv[4];
  const role = process.env.CREATE_ROLE || process.argv[5] || 'marketing';

  if (!name || !email || !password) {
    console.error('Usage: node scripts/createMasterUser.js "Name" email@example.com password [role]');
    process.exit(1);
  }

  try {
    await masterSequelize.authenticate();
    await masterSequelize.sync();

    const existing = await MasterUser.findOne({ where: { email } });
    if (existing) {
      console.log('User already exists:', email);
      process.exit(0);
    }

    const user = await MasterUser.create({ name, email, password, role });
    console.log('Created user:', { id: user.id, email: user.email, role: user.role });
    process.exit(0);
  } catch (err) {
    console.error('Failed to create user', err.message || err);
    process.exit(1);
  }
}

createUser();
