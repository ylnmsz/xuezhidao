import { Router } from 'express'
import {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classesController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listClasses)
router.get('/:id', requireAuth, getClassById)
router.post('/', requireAuth, createClass)
router.put('/:id', requireAuth, updateClass)
router.delete('/:id', requireAuth, deleteClass)

export default router
