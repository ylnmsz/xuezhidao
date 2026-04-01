import { Router } from 'express'
import { getOverview, getClassAnalytics } from '../controllers/analyticsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/overview', requireAuth, getOverview)
router.get('/class/:id', requireAuth, getClassAnalytics)

export default router
