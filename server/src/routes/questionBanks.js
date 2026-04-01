import { Router } from 'express'
import {
  listQuestionBanks,
  getQuestionBankById,
  createQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
} from '../controllers/questionBanksController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listQuestionBanks)
router.get('/:id', requireAuth, getQuestionBankById)
router.post('/', requireAuth, createQuestionBank)
router.put('/:id', requireAuth, updateQuestionBank)
router.delete('/:id', requireAuth, deleteQuestionBank)

export default router
