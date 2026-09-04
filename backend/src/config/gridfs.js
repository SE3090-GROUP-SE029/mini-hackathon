const fs = require('fs/promises');
const path = require('path');
const { Readable } = require('stream');
const { GridFSBucket, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { isMemoryMode } = require('./db');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

function getBucket() {
  if (!mongoose.connection?.db) return null;
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'resourceFiles' });
}

function canUseGridFs() {
  return !isMemoryMode() && mongoose.connection.readyState === 1 && Boolean(mongoose.connection.db);
}

function fileUrlFor(resourceId) {
  return `/api/resources/${encodeURIComponent(resourceId)}/file`;
}

async function saveFile(file, resourceId) {
  const originalName = file.originalname || 'upload';
  const mimeType = file.mimetype || 'application/octet-stream';
  const size = file.size || file.buffer?.length || 0;

  if (canUseGridFs()) {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(originalName, {
      contentType: mimeType,
      metadata: { resourceId, originalName },
    });

    await new Promise((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    return {
      fileStorage: 'gridfs',
      fileId: String(uploadStream.id),
      fileName: originalName,
      fileSize: size,
      fileMimeType: mimeType,
      filePath: String(uploadStream.id),
      fileUrl: fileUrlFor(resourceId),
    };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const storedName = `${resourceId}-${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  await fs.writeFile(path.join(UPLOAD_DIR, storedName), file.buffer);

  return {
    fileStorage: 'disk',
    fileId: storedName,
    fileName: originalName,
    fileSize: size,
    fileMimeType: mimeType,
    filePath: storedName,
    fileUrl: fileUrlFor(resourceId),
  };
}

async function deleteStoredFile(resource) {
  if (!resource?.fileId) return;

  if (resource.fileStorage === 'gridfs' && canUseGridFs()) {
    try {
      await getBucket().delete(new ObjectId(resource.fileId));
    } catch (error) {
      if (error.code !== 'ENOENT' && error.message && !/FileNotFound/i.test(error.message)) {
        console.warn('Could not delete GridFS file:', error.message);
      }
    }
    return;
  }

  if (resource.filePath) {
    try {
      await fs.unlink(path.join(UPLOAD_DIR, resource.filePath));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn('Could not delete disk file:', error.message);
      }
    }
  }
}

async function streamFile(resource, res) {
  if (!resource?.fileId && !resource?.filePath) {
    return false;
  }

  res.setHeader('Content-Type', resource.fileMimeType || 'application/octet-stream');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(resource.fileName || 'resource')}"`
  );

  if (resource.fileStorage === 'gridfs' && canUseGridFs()) {
    const download = getBucket().openDownloadStream(new ObjectId(resource.fileId));
    download.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ success: false, message: 'The file could not be found.' });
      } else {
        res.end();
      }
    });
    download.pipe(res);
    return true;
  }

  const fullPath = path.join(UPLOAD_DIR, resource.filePath || resource.fileId);
  try {
    await fs.access(fullPath);
  } catch {
    return false;
  }
  res.sendFile(fullPath);
  return true;
}

module.exports = {
  saveFile,
  deleteStoredFile,
  streamFile,
  fileUrlFor,
};
