import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../utils/validators.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'MANAGER'));

router.get('/', getUsers);
router.get('/:id', validateId, getUserById);
router.put('/:id', validateId, updateUser);
router.delete('/:id', validateId, authorize('ADMIN'), deleteUser);
router.put('/:id/toggle-status', validateId, toggleUserStatus);

export default router;