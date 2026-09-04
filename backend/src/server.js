require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDb, isDbConnected } = require('./config/db');
const resourceRoutes = require('./routes/resourceRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');

const PORT = Number(process.env.PORT) || 5000;
const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    status: 'ok',
    database: isDbConnected() ? 'connected' : 'disconnected',
  });
});

app.use('/api/resources', resourceRoutes);
app.use(notFound);
app.use(errorHandler);

async function connectWithRetry() {
  try {
    await connectDb(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    if (error.code === 'MISSING_MONGODB_URI') {
      console.error(error.message);
    } else {
      console.error('MongoDB is unavailable. Retrying in 8 seconds...');
    }
    setTimeout(connectWithRetry, 8000);
  }
}

async function start() {
  app.listen(PORT, () => {
    console.log(`EduLanka API listening on port ${PORT}`);
  });
  await connectWithRetry();
}

if (require.main === module) {
  start();
}

module.exports = app;
