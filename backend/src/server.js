require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { isMemoryMode } = require('./config/db');
const resourceRoutes = require('./routes/resourceRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'EduLanka API',
    status: 'ok',
    catalogue: isMemoryMode() ? 'memory' : 'mongodb',
  });
});

app.use('/api/resources', resourceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `No route found for ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`EduLanka API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start EduLanka API:', error.message);
  process.exit(1);
});
