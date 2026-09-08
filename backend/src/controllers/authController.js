import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import pool from '../db/connection.js'

// Login endpoint
export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' })
    }

    // Chercher l'utilisateur en BD
    const query = 'SELECT * FROM users WHERE username = $1'
    const result = await pool.query(query, [username])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const user = result.rows[0]

    // Vérifier le password avec bcrypt
    const passwordValid = await bcryptjs.compare(password, user.password_hash)

    if (!passwordValid) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    // Générer JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your_secret_key_change_this',
      { expiresIn: '24h' }
    )

    // Retourner token et user info
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.created_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Erreur lors de l\'authentification' })
  }
}

// Endpoint pour vérifier le token actuel
export const verify = async (req, res) => {
  try {
    // Le middleware auth a déjà vérifié le token
    res.json({
      user: req.user,
      message: 'Token valide'
    })
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' })
  }
}
