import { Router } from 'express'
import { submitPractice } from '../controllers/practiceController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/submit', requireAuth, submitPractice)

export default router
