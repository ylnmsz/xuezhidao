import { Router } from 'express'
import {
  listErrorBook,
  getErrorItemById,
  getErrorBookStats,
  createErrorItem,
  updateErrorItem,
  masterErrorItem,
  deleteErrorItem,
} from '../controllers/errorbookController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listErrorBook)
router.get('/stats', requireAuth, getErrorBookStats)
router.get('/:id', requireAuth, getErrorItemById)
router.post('/', requireAuth, createErrorItem)
router.put('/:id', requireAuth, updateErrorItem)
router.post('/:id/master', requireAuth, masterErrorItem)
router.delete('/:id', requireAuth, deleteErrorItem)

export default router
