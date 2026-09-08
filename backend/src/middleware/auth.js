import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const secret = process.env.JWT_SECRET || 'your_secret_key_change_this'
    
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expiré' })
        }
        return res.status(403).json({ error: 'Token invalide' })
      }

      req.user = user
      next()
    })
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Erreur d\'authentification' })
  }
}

// Middleware pour vérifier un rôle spécifique
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' })
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé - rôle insuffisant' })
    }

    next()
  }
}
