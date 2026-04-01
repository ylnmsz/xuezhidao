import { Router } from 'express'
import {
  listUsers,
  getMe,
  updateMe,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listUsers)
router.get('/me', requireAuth, getMe)
router.put('/me', requireAuth, updateMe)
router.get('/:id', requireAuth, getUserById)
router.post('/', requireAuth, createUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, deleteUser)

export default router
