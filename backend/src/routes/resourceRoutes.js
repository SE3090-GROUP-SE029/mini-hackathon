const express = require('express');
const resourceController = require('../controllers/resourceController');
const { resourceUpload, handleMulterError } = require('../middleware/uploadMiddleware');
const { requireDatabase } = require('../middleware/errorHandler');

const router = express.Router();

router.use(requireDatabase);

router.get('/', resourceController.getResources);
router.get('/:id/file', resourceController.getResourceFile);
router.get('/:id', resourceController.getResource);
router.post('/', resourceUpload, handleMulterError, resourceController.createResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
