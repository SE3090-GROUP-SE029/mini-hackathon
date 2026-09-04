const mongoose = require('mongoose');
const { resetBucket } = require('./gridfs');

async function connectDb(uri) {
  if (!uri || uri === 'YOUR_MONGODB_CONNECTION_STRING') {
    const error = new Error('MONGODB_URI is missing. Add a valid connection string to backend/.env');
    error.code = 'MISSING_MONGODB_URI';
    throw error;
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('disconnected', () => {
    resetBucket();
  });

  await mongoose.connect(uri);
  return mongoose.connection;
}

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDb,
  isDbConnected,
};
