import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
} from '../controllers/property.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateProperty, validateId } from '../utils/validators.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProperties)
  .post(validateProperty, createProperty);

router.route('/:id')
  .get(validateId, getPropertyById)
  .put(validateId, updateProperty)
  .delete(validateId, authorize('ADMIN', 'MANAGER'), deleteProperty);

router.post('/:id/images', validateId, upload.array('images', 10), uploadPropertyImages);

export default router;