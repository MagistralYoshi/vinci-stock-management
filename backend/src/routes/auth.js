import express from 'express'
import { login, verify } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/login - Login
router.post('/login', login)

// GET /api/auth/verify - Vérifier le token
router.get('/verify', authenticateToken, verify)

export default router
