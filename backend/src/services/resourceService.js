const crypto = require('crypto');
const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const { getResourceBucket } = require('../config/gridfs');
const { sanitiseFileName } = require('../utils/sanitize');

function hashFileBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function uploadBufferToGridFS(file) {
  const bucket = getResourceBucket();
  const filename = sanitiseFileName(file.originalname);

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalName: filename,
        mimeType: file.mimetype,
      },
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.end(file.buffer);
  });
}

async function deleteGridFsFile(fileId) {
  if (!fileId) return;

  try {
    const bucket = getResourceBucket();
    await bucket.delete(new mongoose.Types.ObjectId(String(fileId)));
  } catch (error) {
    if (error && error.code !== 'ENOENT' && error.message !== 'FileNotFound') {
      throw error;
    }
  }
}

async function findByFileHash(fileHash) {
  return Resource.findOne({ fileHash });
}

async function listResources() {
  return Resource.find().sort({ createdAt: -1 }).limit(300);
}

async function getResourceById(id) {
  return Resource.findById(id);
}

async function createResource(payload) {
  const resource = await Resource.create(payload);
  return resource;
}

async function deleteResourceById(id) {
  const resource = await Resource.findById(id);
  if (!resource) return null;

  await deleteGridFsFile(resource.gridFsFileId);
  await resource.deleteOne();
  return resource;
}

async function getGridFsFile(fileId) {
  const bucket = getResourceBucket();
  const files = await bucket.find({ _id: new mongoose.Types.ObjectId(String(fileId)) }).toArray();
  return files[0] || null;
}

function openDownloadStream(fileId) {
  const bucket = getResourceBucket();
  return bucket.openDownloadStream(new mongoose.Types.ObjectId(String(fileId)));
}

module.exports = {
  hashFileBuffer,
  uploadBufferToGridFS,
  deleteGridFsFile,
  findByFileHash,
  listResources,
  getResourceById,
  createResource,
  deleteResourceById,
  getGridFsFile,
  openDownloadStream,
};
