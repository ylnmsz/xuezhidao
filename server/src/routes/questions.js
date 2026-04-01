import { Router } from 'express'
import {
  listQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listQuestions)
router.get('/:id', requireAuth, getQuestionById)
router.post('/', requireAuth, createQuestion)
router.put('/:id', requireAuth, updateQuestion)
router.delete('/:id', requireAuth, deleteQuestion)

export default router
