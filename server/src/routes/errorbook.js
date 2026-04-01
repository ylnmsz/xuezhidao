import { Router } from 'express'
import {
  listErrorBook,
  getErrorItemById,
  createErrorItem,
  updateErrorItem,
  deleteErrorItem,
} from '../controllers/errorbookController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listErrorBook)
router.get('/:id', requireAuth, getErrorItemById)
router.post('/', requireAuth, createErrorItem)
router.put('/:id', requireAuth, updateErrorItem)
router.delete('/:id', requireAuth, deleteErrorItem)

export default router
