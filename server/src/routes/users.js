import { Router } from 'express'
import {
  listUsers,
  getMe,
  updateMe,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyStats,
  getMyPointsLog,
  recalculateMyStats,
  changePassword,
} from '../controllers/usersController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listUsers)
router.get('/me', requireAuth, getMe)
router.put('/me', requireAuth, updateMe)
router.get('/me/stats', requireAuth, getMyStats)
router.post('/me/change-password', requireAuth, changePassword)
router.get('/me/points-log', requireAuth, getMyPointsLog)
router.post('/me/recalculate-stats', requireAuth, recalculateMyStats)
router.get('/:id', requireAuth, getUserById)
router.post('/', requireAuth, createUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, deleteUser)

export default router
