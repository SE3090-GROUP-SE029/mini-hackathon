const {
  SUBJECTS,
  EDUCATION_LEVELS,
  RESOURCE_TYPES,
  LANGUAGES,
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  PROVIDER_MAX,
  UPLOADER_MAX,
} = require('../constants/resourceEnums');
const { sanitiseText, sanitiseTags, sanitiseFileName } = require('../utils/sanitize');
const { getFileValidationMessage, getExtension } = require('../utils/fileValidation');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { isValidObjectId } = require('../middleware/errorHandler');
const resourceService = require('../services/resourceService');

function validateMetadata(body) {
  const title = sanitiseText(body.title, TITLE_MAX);
  const description = sanitiseText(body.description, DESCRIPTION_MAX);
  const subject = sanitiseText(body.subject, 80);
  const educationLevel = sanitiseText(body.educationLevel || body.level, 40);
  const resourceType = sanitiseText(body.resourceType || body.type, 40);
  const language = sanitiseText(body.language, 40);
  const providerName = sanitiseText(body.providerName || body.provider, PROVIDER_MAX);
  const uploadedBy = sanitiseText(body.uploadedBy, UPLOADER_MAX) || 'Anonymous contributor';
  const tags = sanitiseTags(body.tags);

  if (!title) return { error: 'Please enter a resource title.' };
  if (title.length < TITLE_MIN) {
    return { error: `Please enter a resource title of at least ${TITLE_MIN} characters.` };
  }

  if (!description) return { error: 'Please enter a short description of this resource.' };
  if (description.length < DESCRIPTION_MIN) {
    return { error: 'Please add a slightly longer description so students know what this resource covers.' };
  }

  if (!subject || !SUBJECTS.includes(subject)) {
    return { error: 'Please select a subject.' };
  }

  if (!educationLevel || !EDUCATION_LEVELS.includes(educationLevel)) {
    return { error: 'Please select an education level.' };
  }

  if (!resourceType || !RESOURCE_TYPES.includes(resourceType)) {
    return { error: 'Please select a resource type.' };
  }

  if (!language || !LANGUAGES.includes(language)) {
    return { error: 'Please select a language.' };
  }

  return {
    value: {
      title,
      description,
      subject,
      educationLevel,
      resourceType,
      language,
      providerName,
      uploadedBy,
      tags,
    },
  };
}

async function getResources(req, res, next) {
  try {
    const resources = await resourceService.listResources();
    return sendSuccess(res, resources.map((resource) => resource.toClient()));
  } catch (error) {
    return next(error);
  }
}

async function getResource(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 'We could not find that resource.', 404);
    }

    const resource = await resourceService.getResourceById(req.params.id);
    if (!resource) {
      return sendError(res, 'We could not find that resource.', 404);
    }

    return sendSuccess(res, resource.toClient());
  } catch (error) {
    return next(error);
  }
}

async function createResource(req, res, next) {
  let uploadedFileId = null;

  try {
    const fileError = getFileValidationMessage(req.file);
    if (fileError) {
      return sendError(res, fileError, 400);
    }

    const parsed = validateMetadata(req.body);
    if (parsed.error) {
      return sendError(res, parsed.error, 400);
    }

    const fileHash = resourceService.hashFileBuffer(req.file.buffer);
    const duplicate = await resourceService.findByFileHash(fileHash);
    if (duplicate) {
      return sendError(res, 'This file has already been uploaded.', 409);
    }

    uploadedFileId = await resourceService.uploadBufferToGridFS(req.file);

    const resource = await resourceService.createResource({
      ...parsed.value,
      fileName: sanitiseFileName(req.file.originalname),
      fileType: getExtension(req.file.originalname).replace('.', '').toUpperCase() || 'PDF',
      fileSize: req.file.size,
      fileHash,
      gridFsFileId: uploadedFileId,
    });

    return sendSuccess(res, resource.toClient(), 201);
  } catch (error) {
    if (uploadedFileId) {
      await resourceService.deleteGridFsFile(uploadedFileId).catch(() => {});
    }
    return next(error);
  }
}

function safeContentDisposition(fileName, download) {
  const fallback = 'resource.pdf';
  const asciiName = String(fileName || fallback).replace(/["\\]/g, '');
  const type = download ? 'attachment' : 'inline';
  return `${type}; filename="${asciiName}"`;
}

async function getResourceFile(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 'We could not find that resource.', 404);
    }

    const resource = await resourceService.getResourceById(req.params.id);
    if (!resource) {
      return sendError(res, 'We could not find that resource.', 404);
    }

    const storedFile = await resourceService.getGridFsFile(resource.gridFsFileId);
    if (!storedFile) {
      return sendError(res, 'This file is no longer available.', 404);
    }

    const download = req.query.download === '1' || req.query.download === 'true';
    const contentType = storedFile.contentType || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', storedFile.length);
    res.setHeader('Content-Disposition', safeContentDisposition(resource.fileName, download));
    res.setHeader('Cache-Control', 'private, max-age=300');

    const stream = resourceService.openDownloadStream(resource.gridFsFileId);
    stream.on('error', (error) => {
      if (!res.headersSent) {
        sendError(res, 'This file is no longer available.', 404);
      } else {
        res.end();
      }
      return error;
    });

    return stream.pipe(res);
  } catch (error) {
    return next(error);
  }
}

async function deleteResource(req, res, next) {
  try {
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey || req.get('x-admin-key') !== adminKey) {
      return sendError(res, 'You do not have permission to delete this resource.', 403);
    }

    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 'We could not find that resource.', 404);
    }

    const deleted = await resourceService.deleteResourceById(req.params.id);
    if (!deleted) {
      return sendError(res, 'We could not find that resource.', 404);
    }

    return sendSuccess(res, { id: String(deleted._id) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getResources,
  getResource,
  createResource,
  getResourceFile,
  deleteResource,
};
