import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
  updateLeadStatus,
} from '../controllers/lead.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateLead, validateId } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLeads)
  .post(validateLead, createLead);

router.route('/:id')
  .get(validateId, getLeadById)
  .put(validateId, updateLead)
  .delete(validateId, authorize('ADMIN', 'MANAGER'), deleteLead);

router.put('/:id/assign', validateId, authorize('ADMIN', 'MANAGER'), assignLead);
router.put('/:id/status', validateId, updateLeadStatus);

export default router;