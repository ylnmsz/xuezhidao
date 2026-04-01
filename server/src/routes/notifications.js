import { Router } from 'express'
import {
  listNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../controllers/notificationsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listNotifications)
router.get('/:id', requireAuth, getNotificationById)
router.post('/', requireAuth, createNotification)
router.put('/:id', requireAuth, updateNotification)
router.delete('/:id', requireAuth, deleteNotification)

export default router
