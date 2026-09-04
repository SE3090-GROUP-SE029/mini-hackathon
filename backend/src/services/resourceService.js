const Resource = require('../models/Resource');
const { sampleResources } = require('../data/sampleResources');
const { escapeRegex, slugify } = require('../utils/sanitize');
const { recommendResources } = require('../utils/recommendationEngine');
const { isMemoryMode } = require('../config/db');
const { saveFile, deleteStoredFile, streamFile, fileUrlFor } = require('../config/gridfs');

const userResources = [];
const deletedIds = new Set();

function toPlain(resource) {
  if (!resource) return null;
  if (typeof resource.toJSON === 'function') return resource.toJSON();
  return { ...resource };
}

function withAuthor(resource) {
  if (!resource) return null;
  return {
    ...resource,
    author: resource.author || resource.provider || '',
    provider: resource.provider || resource.author || '',
  };
}

function matchesFilters(resource, { search, subject, educationLevel, language, type }) {
  if (subject && resource.subject !== subject) return false;
  if (educationLevel && resource.educationLevel !== educationLevel) return false;
  if (language && resource.language !== language) return false;
  if (type && resource.type !== type) return false;

  if (search) {
    const needle = String(search).trim().toLowerCase();
    const haystack = `${resource.title} ${resource.description} ${resource.subject}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

function sortList(resources, sort) {
  const copy = [...resources];
  if (sort === 'az') {
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
  return copy.sort((a, b) => {
    const dateDiff = new Date(b.uploadDate) - new Date(a.uploadDate);
    return dateDiff || a.title.localeCompare(b.title);
  });
}

function buildFilter({ search, subject, educationLevel, language, type }) {
  const filter = {};

  if (subject) filter.subject = subject;
  if (educationLevel) filter.educationLevel = educationLevel;
  if (language) filter.language = language;
  if (type) filter.type = type;

  if (search) {
    const safe = escapeRegex(search);
    const regex = new RegExp(safe, 'i');
    filter.$or = [{ title: regex }, { description: regex }, { subject: regex }];
  }

  return filter;
}

function sortDocuments(sort) {
  if (sort === 'az') return { title: 1 };
  return { uploadDate: -1, title: 1 };
}

function wrapResult(data, query, source) {
  return {
    data: data.map(withAuthor),
    meta: {
      resultCount: data.length,
      source,
      filters: {
        search: query.search || '',
        subject: query.subject || '',
        educationLevel: query.educationLevel || '',
        language: query.language || '',
        type: query.type || '',
        sort: query.sort === 'az' ? 'az' : 'newest',
      },
    },
  };
}

function mergedCatalogue(mongoItems = []) {
  const overrides = new Map([
    ...mongoItems.map((resource) => [resource.id, resource]),
    ...userResources.map((resource) => [resource.id, resource]),
  ]);
  const extras = sampleResources.filter(
    (resource) => !deletedIds.has(resource.id) && !overrides.has(resource.id)
  );
  return [...overrides.values(), ...extras.map((resource) => ({ ...resource }))];
}

function findMemoryResource(id) {
  return mergedCatalogue().find((resource) => resource.id === id) || null;
}

function upsertMemoryResource(resource) {
  const index = userResources.findIndex((item) => item.id === resource.id);
  if (index >= 0) {
    userResources[index] = resource;
  } else {
    userResources.unshift(resource);
  }
  deletedIds.delete(resource.id);
  return resource;
}

async function listFromMemory(query) {
  const filtered = mergedCatalogue().filter((resource) => matchesFilters(resource, query));
  return wrapResult(sortList(filtered, query.sort), query, 'memory');
}

async function listResources(query) {
  if (isMemoryMode()) {
    return listFromMemory(query);
  }

  try {
    const documents = await Resource.find({});
    const merged = mergedCatalogue(documents.map(toPlain));
    const filtered = merged.filter((resource) => matchesFilters(resource, query));
    return wrapResult(sortList(filtered, query.sort), query, 'mongodb');
  } catch (error) {
    console.warn('Falling back to sample catalogue:', error.message);
    return listFromMemory(query);
  }
}

async function getResourceById(id) {
  if (!isMemoryMode()) {
    try {
      const document = await Resource.findOne({ id });
      if (document) return withAuthor(toPlain(document));
    } catch (error) {
      console.warn('Resource lookup fell back to sample catalogue:', error.message);
    }
  }

  return withAuthor(findMemoryResource(id));
}

function buildRecord(input, extras = {}) {
  return {
    title: input.title,
    description: input.description,
    subject: input.subject,
    educationLevel: input.educationLevel,
    type: input.type,
    author: input.author,
    provider: input.provider || input.author,
    language: input.language || 'English',
    tags: input.tags || [],
    ...extras,
  };
}

async function createResource(input, file) {
  const id = slugify(input.title);
  const fileMeta = await saveFile(file, id);
  const record = buildRecord(input, {
    id,
    uploadDate: new Date().toISOString().slice(0, 10),
    externalLink: fileMeta.fileUrl,
    ...fileMeta,
    fileUrl: fileUrlFor(id),
  });

  if (!isMemoryMode()) {
    try {
      const document = await Resource.create({
        ...record,
        uploadDate: new Date(record.uploadDate),
      });
      return withAuthor(toPlain(document));
    } catch (error) {
      await deleteStoredFile(fileMeta);
      throw error;
    }
  }

  return withAuthor(upsertMemoryResource(record));
}

async function updateResource(id, input, file) {
  const current = await getResourceById(id);
  if (!current) return null;

  let fileMeta = {
    fileStorage: current.fileStorage || '',
    fileId: current.fileId || '',
    fileName: current.fileName || '',
    fileSize: current.fileSize || 0,
    fileMimeType: current.fileMimeType || '',
    filePath: current.filePath || '',
    fileUrl: current.fileUrl || (current.fileId ? fileUrlFor(id) : ''),
  };

  if (file) {
    const saved = await saveFile(file, id);
    await deleteStoredFile(current);
    fileMeta = { ...saved, fileUrl: fileUrlFor(id) };
  } else if (input.removeFile) {
    await deleteStoredFile(current);
    fileMeta = {
      fileStorage: '',
      fileId: '',
      fileName: '',
      fileSize: 0,
      fileMimeType: '',
      filePath: '',
      fileUrl: '',
    };
  }

  const record = buildRecord(input, {
    id,
    uploadDate: current.uploadDate,
    externalLink: current.externalLink && !current.fileId ? current.externalLink : fileMeta.fileUrl || current.externalLink || '',
    ...fileMeta,
  });

  if (!isMemoryMode()) {
    const document = await Resource.findOneAndUpdate(
      { id },
      { ...record, uploadDate: new Date(record.uploadDate) },
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (document) return withAuthor(toPlain(document));
  }

  return withAuthor(upsertMemoryResource(record));
}

async function deleteResource(id) {
  const current = await getResourceById(id);
  if (!current) return false;

  await deleteStoredFile(current);

  if (!isMemoryMode()) {
    await Resource.deleteOne({ id });
  }

  deletedIds.add(id);
  const index = userResources.findIndex((item) => item.id === id);
  if (index >= 0) {
    userResources.splice(index, 1);
  }
  return true;
}

async function downloadResourceFile(id, res) {
  const resource = await getResourceById(id);
  if (!resource) return { found: false };
  const streamed = await streamFile(resource, res);
  return { found: streamed, resource };
}

async function recommend(preferences) {
  let resources = mergedCatalogue();

  if (!isMemoryMode()) {
    try {
      const documents = await Resource.find({});
      resources = mergedCatalogue(documents.map(toPlain));
    } catch (error) {
      console.warn('Recommendations fell back to sample catalogue:', error.message);
    }
  }

  return recommendResources(resources, preferences);
}

module.exports = {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResourceFile,
  recommend,
};
