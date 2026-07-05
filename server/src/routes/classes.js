import { Router } from 'express'
import {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classesController.js'
import { createInvite, listInvitesForClass } from '../controllers/classInvitesController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listClasses)
router.get('/:id', requireAuth, getClassById)
router.post('/', requireAuth, createClass)
router.put('/:id', requireAuth, updateClass)
router.delete('/:id', requireAuth, deleteClass)

// Invites for a class (create and list) mounted under /classes/:id/invites
router.post('/:id/invites', requireAuth, createInvite)
router.get('/:id/invites', requireAuth, listInvitesForClass)

export default router
