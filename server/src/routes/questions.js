import { Router } from 'express'
import {
  listQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  uploadQuestionsCsv,
  bulkCreateQuestions,
  uploadQuestionsDocx,
  previewQuestionsFromDocx,
  startBatchDocxAsync,
  getBatchTaskStatus,
  listBatchTasks,
} from '../controllers/questionsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, listQuestions)
router.get('/batch-tasks', requireAuth, listBatchTasks)
router.get('/batch-status/:taskId', requireAuth, getBatchTaskStatus)
router.get('/:id', requireAuth, getQuestionById)
router.post('/', requireAuth, createQuestion)
router.post('/batch', requireAuth, uploadQuestionsCsv, bulkCreateQuestions)
router.post('/batch-docx', requireAuth, uploadQuestionsDocx, previewQuestionsFromDocx)
router.post('/batch-docx-async', requireAuth, uploadQuestionsDocx, startBatchDocxAsync)
router.put('/:id', requireAuth, updateQuestion)
router.delete('/:id', requireAuth, deleteQuestion)

export default router
