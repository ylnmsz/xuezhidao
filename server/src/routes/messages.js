import { Router } from 'express'
import {
  listMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messagesController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listMessages)
router.get('/:id', requireAuth, getMessageById)
router.post('/', requireAuth, createMessage)
router.put('/:id', requireAuth, updateMessage)
router.delete('/:id', requireAuth, deleteMessage)

export default router
