import fs from 'fs'
import path from 'path'
import multer from 'multer'

const avatarsDir = path.resolve('uploads', 'avatars')
const questionImagesDir = path.resolve('uploads', 'questions')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(avatarsDir, { recursive: true })
    } catch (error) {
      return cb(error)
    }
    return cb(null, avatarsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.png'
    const safeExt = ext.length <= 10 ? ext : '.png'
    const fileName = `${req.user.id}-${Date.now()}${safeExt}`
    cb(null, fileName)
  },
})

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) {
      return cb(null, true)
    }
    return cb(new Error('Only image uploads are allowed.'))
  },
}).single('avatar')

const questionImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(questionImagesDir, { recursive: true })
    } catch (error) {
      return cb(error)
    }
    return cb(null, questionImagesDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.png'
    const safeExt = ext.length <= 10 ? ext : '.png'
    const fileName = `${req.user.id}-${Date.now()}${safeExt}`
    cb(null, fileName)
  },
})

export const uploadQuestionImage = multer({
  storage: questionImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) {
      return cb(null, true)
    }
    return cb(new Error('Only image uploads are allowed.'))
  },
}).single('image')

export const handleAvatarUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }
  const urlPath = `/uploads/avatars/${req.file.filename}`
  return res.json({ url: urlPath })
}

export const handleQuestionImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }
  const urlPath = `/uploads/questions/${req.file.filename}`
  return res.json({ url: urlPath })
}
