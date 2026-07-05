import { Router } from 'express'
import { getStudentRankings, getClassRankings, getRankingSummary } from '../controllers/rankingsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/summary', requireAuth, getRankingSummary)
router.get('/student', requireAuth, getStudentRankings)
router.get('/class', requireAuth, getClassRankings)

export default router
