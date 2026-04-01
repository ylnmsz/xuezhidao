import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { uploadAvatar, handleAvatarUpload } from '../controllers/uploadController.js'

const router = Router()

router.post('/avatar', requireAuth, (req, res) => {
  uploadAvatar(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || 'Upload failed.' })
    }
    return handleAvatarUpload(req, res)
  })
})

export default router
