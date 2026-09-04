const resourceService = require('../services/resourceService');
const { success, failure } = require('../utils/apiResponse');

async function listResources(req, res, next) {
  try {
    const { data, meta } = await resourceService.listResources({
      search: req.query.search,
      subject: req.query.subject,
      educationLevel: req.query.educationLevel,
      language: req.query.language,
      type: req.query.type,
      sort: req.query.sort,
    });
    return success(res, data, meta);
  } catch (error) {
    return next(error);
  }
}

async function getResource(req, res, next) {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    if (!resource) {
      return failure(res, 'This resource could not be found.', 404);
    }
    return success(res, resource);
  } catch (error) {
    return next(error);
  }
}

async function createResource(req, res, next) {
  try {
    const resource = await resourceService.createResource(req.resourceInput, req.file);
    return success(res, resource, {}, 201);
  } catch (error) {
    return next(error);
  }
}

async function updateResource(req, res, next) {
  try {
    const resource = await resourceService.updateResource(
      req.params.id,
      req.resourceInput,
      req.file
    );
    if (!resource) {
      return failure(res, 'This resource could not be found.', 404);
    }
    return success(res, resource);
  } catch (error) {
    return next(error);
  }
}

async function deleteResource(req, res, next) {
  try {
    const removed = await resourceService.deleteResource(req.params.id);
    if (!removed) {
      return failure(res, 'This resource could not be found.', 404);
    }
    return success(res, { id: req.params.id }, { deleted: true });
  } catch (error) {
    return next(error);
  }
}

async function downloadFile(req, res, next) {
  try {
    const result = await resourceService.downloadResourceFile(req.params.id, res);
    if (!result.found) {
      return failure(res, 'No file is attached to this resource.', 404);
    }
    return undefined;
  } catch (error) {
    return next(error);
  }
}

async function recommendResources(req, res, next) {
  try {
    const recommendation = await resourceService.recommend(req.recommendationInput);
    return success(res, recommendation, {
      resultCount: recommendation.resultCount,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  downloadFile,
  recommendResources,
};
