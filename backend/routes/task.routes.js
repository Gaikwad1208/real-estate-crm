import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.js';
import { validateTask, validateId } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(validateId, getTaskById)
  .put(validateId, updateTask)
  .delete(validateId, deleteTask);

router.put('/:id/status', validateId, updateTaskStatus);

export default router;