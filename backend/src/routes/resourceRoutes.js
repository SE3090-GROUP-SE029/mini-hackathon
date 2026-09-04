const express = require('express');
const resourceController = require('../controllers/resourceController');
const validateRecommendation = require('../middleware/validateRecommendation');
const validateResource = require('../middleware/validateResource');
const { optionalFileUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', resourceController.listResources);
router.post('/', optionalFileUpload, validateResource, resourceController.createResource);
router.post(
  '/recommend',
  validateRecommendation,
  resourceController.recommendResources
);
router.get('/:id/file', resourceController.downloadFile);
router.get('/:id', resourceController.getResource);
router.put('/:id', optionalFileUpload, validateResource, resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
