import { Router } from 'express'
import {
  listAssignments,
  getAssignmentById,
  listSubmissions,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listAssignments)
router.get('/:id', requireAuth, getAssignmentById)
router.get('/:id/submissions', requireAuth, listSubmissions)
router.post('/', requireAuth, createAssignment)
router.put('/:id', requireAuth, updateAssignment)
router.delete('/:id', requireAuth, deleteAssignment)

export default router
