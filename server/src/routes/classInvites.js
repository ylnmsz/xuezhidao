import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  createInvite,
  listInvitesForClass,
  joinByCode,
} from '../controllers/classInvitesController.js'

const router = Router()

router.post('/:id/invites', requireAuth, createInvite)
router.get('/:id/invites', requireAuth, listInvitesForClass)
router.post('/join', requireAuth, joinByCode)

export default router
