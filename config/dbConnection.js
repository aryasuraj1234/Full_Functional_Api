const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));