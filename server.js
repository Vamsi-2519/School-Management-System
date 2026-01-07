// require('dotenv').config();
// const app = require('./app');
// const sequelizeMaster = require('./src/config/masterDb');


// const PORT = process.env.PORT || 5000;

// (async () => {
//   try {
//     await sequelizeMaster.authenticate();
//     console.log('✅ Master DB connected');

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('❌ Server start failed', err);
//   }
// })();




// const express = require('express');
// const app = express();
// require('dotenv').config();

// app.use(express.json());

// // ✅ Import master DB correctly
// const masterSequelize = require('./src/config/masterDb');

// // ✅ Import routes
// const marketingRoutes = require('./src/routes/marketing.routes');


// app.use('/', marketingRoutes);


// // ✅ Sync master DB and start server
// (async () => {
//   try {
//     await masterSequelize.authenticate();
//     console.log('✅ Master DB connected');

//     await masterSequelize.sync(); // create tables
//     console.log('✅ Master DB synced');

//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
//     });
//   } catch (err) {
//     console.error('❌ Server start failed', err);
//   }
// })();




// const express = require('express');
// const app = express();
// require('dotenv').config();

// // ✅ Parse JSON
// app.use(express.json());

// // Import routes
// const onboardingRoutes = require('./src/routes/marketing.routes');
// app.use('/', onboardingRoutes);

// // Start server
// const masterSequelize = require('./src/config/masterDb');
// (async () => {
//   try {
//     await masterSequelize.authenticate();
//     await masterSequelize.sync();
//     console.log('✅ Master DB ready');

//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
//     });
//   } catch (err) {
//     console.error('❌ Server start failed', err);
//   }
// })();



const express = require('express');
const app = express();
require('dotenv').config();

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Parse x-www-form-urlencoded (form-data)
app.use(express.urlencoded({ extended: true }));

// Import router
const onboardingRoutes = require('./src/routes/marketing.routes');
// const loginRoutes = require('./src/routes/auth.routes');

app.use('/', onboardingRoutes);

// app.use('/', loginRoutes);

// Master DB
const masterSequelize = require('./src/config/masterDb');

(async () => {
  try {
    await masterSequelize.authenticate();
    console.log('✅ Master DB connected');
    await masterSequelize.sync();
    console.log('✅ Master DB synced');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error('❌ Server start failed', err);
  }
})();


