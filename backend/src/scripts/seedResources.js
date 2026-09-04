require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Resource = require('../models/Resource');
const { sampleResources } = require('../data/sampleResources');

async function seedResources() {
  const connected = await connectDB();
  if (!connected) {
    console.warn('Seed skipped: MongoDB is not reachable. The API will still serve sample resources in memory.');
    return;
  }

  for (const resource of sampleResources) {
    await Resource.findOneAndUpdate(
      { id: resource.id },
      { ...resource, uploadDate: new Date(resource.uploadDate) },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  const count = await Resource.countDocuments();
  console.log(`Seeded ${sampleResources.length} EduLanka resources. Collection now has ${count} documents.`);
}

seedResources()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
