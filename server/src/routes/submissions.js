import { Router } from 'express'
import {
  listSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from '../controllers/submissionsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listSubmissions)
router.get('/:id', requireAuth, getSubmissionById)
router.post('/', requireAuth, createSubmission)
router.put('/:id', requireAuth, updateSubmission)
router.delete('/:id', requireAuth, deleteSubmission)

export default router
