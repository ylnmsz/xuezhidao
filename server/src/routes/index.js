import { Router } from 'express'
import authRoutes from './auth.js'
import userRoutes from './users.js'
import classRoutes from './classes.js'
import classMemberRoutes from './classMembers.js'
import assignmentRoutes from './assignments.js'
import submissionRoutes from './submissions.js'
import questionRoutes from './questions.js'
import questionBankRoutes from './questionBanks.js'
import messageRoutes from './messages.js'
import notificationRoutes from './notifications.js'
import rankingRoutes from './rankings.js'
import errorbookRoutes from './errorbook.js'
import analyticsRoutes from './analytics.js'
import uploadRoutes from './uploads.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/classes', classRoutes)
router.use('/class-members', classMemberRoutes)
router.use('/assignments', assignmentRoutes)
router.use('/submissions', submissionRoutes)
router.use('/questions', questionRoutes)
router.use('/question-banks', questionBankRoutes)
router.use('/messages', messageRoutes)
router.use('/notifications', notificationRoutes)
router.use('/rankings', rankingRoutes)
router.use('/errorbook', errorbookRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/uploads', uploadRoutes)

export default router
