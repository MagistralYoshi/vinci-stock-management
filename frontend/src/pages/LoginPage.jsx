import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères')
      return
    }

    // Simuler une authentification simple avec localStorage
    const users = JSON.parse(localStorage.getItem('app_users') || '[]')
    const user = users.find(u => u.username === username && u.password === password)

    if (user) {
      localStorage.setItem('app_currentUser', JSON.stringify(user))
      onLogin(user)
    } else {
      setError('Identifiants incorrects')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères')
      return
    }

    const users = JSON.parse(localStorage.getItem('app_users') || '[]')
    
    if (users.find(u => u.username === username)) {
      setError('Cet utilisateur existe déjà')
      return
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      createdAt: new Date().toISOString(),
      role: 'user'
    }

    users.push(newUser)
    localStorage.setItem('app_users', JSON.stringify(users))
    localStorage.setItem('app_currentUser', JSON.stringify(newUser))
    onLogin(newUser)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a202c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            📦
          </h1>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>
            Gestionnaire de Stock
          </h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            {isRegistering ? 'Créer un compte' : 'Connectez-vous'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            borderLeft: '4px solid #ef4444'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#0f172a',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="votre_username"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#0f172a',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '0.875rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
          >
            {isRegistering ? '✓ Créer un compte' : '🔓 Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {isRegistering ? 'Vous avez déjà un compte?' : "Vous n'avez pas de compte?"}
            {' '}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
                setUsername('')
                setPassword('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 'inherit',
                textDecoration: 'underline'
              }}
            >
              {isRegistering ? 'Se connecter' : "S'inscrire"}
            </button>
          </p>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.8rem',
          color: '#9ca3af'
        }}>
          <p style={{ marginBottom: '0.25rem' }}>📝 Démo:</p>
          <p>user: admin | pass: admin</p>
        </div>
      </div>
    </div>
  )
}
