import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contact.controller.js';
import { protect } from '../middleware/auth.js';
import { validateContact, validateId } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getContacts)
  .post(validateContact, createContact);

router.route('/:id')
  .get(validateId, getContactById)
  .put(validateId, updateContact)
  .delete(validateId, deleteContact);

export default router;