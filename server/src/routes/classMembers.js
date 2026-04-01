import { Router } from 'express'
import {
  listClassMembers,
  getClassMemberById,
  createClassMember,
  updateClassMember,
  deleteClassMember,
} from '../controllers/classMembersController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listClassMembers)
router.get('/:id', requireAuth, getClassMemberById)
router.post('/', requireAuth, createClassMember)
router.put('/:id', requireAuth, updateClassMember)
router.delete('/:id', requireAuth, deleteClassMember)

export default router
