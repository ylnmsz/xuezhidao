import { Router } from 'express'
import { getStudentRankings, getClassRankings } from '../controllers/rankingsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/student', requireAuth, getStudentRankings)
router.get('/class', requireAuth, getClassRankings)

export default router
