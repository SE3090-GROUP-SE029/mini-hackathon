const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const BUCKET_NAME = 'resourceFiles';
let bucket = null;

function getResourceBucket() {
  if (bucket) return bucket;

  const db = mongoose.connection.db;
  if (!db) {
    const error = new Error('Database is not connected.');
    error.status = 503;
    throw error;
  }

  bucket = new GridFSBucket(db, { bucketName: BUCKET_NAME });
  return bucket;
}

function resetBucket() {
  bucket = null;
}

module.exports = {
  BUCKET_NAME,
  getResourceBucket,
  resetBucket,
};
