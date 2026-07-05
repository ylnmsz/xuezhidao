import { Router } from 'express'
import {
  listMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  getConversations,
  getConversation,
  getUnreadTotal,
  markAsRead,
} from '../controllers/messagesController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listMessages)
router.get('/unread-total', requireAuth, getUnreadTotal)
router.get('/conversations', requireAuth, getConversations)
router.get('/conversation/:userId', requireAuth, getConversation)
router.get('/:id', requireAuth, getMessageById)
router.post('/', requireAuth, createMessage)
router.put('/read/:senderId', requireAuth, markAsRead)
router.put('/:id', requireAuth, updateMessage)
router.delete('/:id', requireAuth, deleteMessage)

export default router
