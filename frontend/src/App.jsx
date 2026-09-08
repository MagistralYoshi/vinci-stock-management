import { useState, useEffect } from 'react'
import axios from 'axios'
import ItemsPage from './pages/ItemsPage'
import HistoryPage from './pages/HistoryPage'
import LowStockPage from './pages/LowStockPage'
import StatisticsPage from './pages/StatisticsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import DeveloperPanel from './pages/DeveloperPanel'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Service API
const api = {
  items: {
    getAll: (params = {}) => axios.get(`${API_URL}/items`, { params }),
    getById: (id) => axios.get(`${API_URL}/items/${id}`),
    create: (data) => axios.post(`${API_URL}/items`, data),
    update: (id, data) => axios.put(`${API_URL}/items/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/items/${id}`)
  },
  history: {
    getAll: (params = {}) => axios.get(`${API_URL}/history`, { params }),
    getItemHistory: (itemId) => axios.get(`${API_URL}/history/item/${itemId}`),
    recordAction: (data) => axios.post(`${API_URL}/history/action`, data)
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [message, setMessage] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [scrolled, setScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('app_currentUser')
    return saved ? JSON.parse(saved) : null
  })

  // Créer les utilisateurs par défaut s'il n'existe pas
  // ⚠️ IMPORTANT: Ces mots de passe doivent être changés en production!
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('app_users') || '[]')
    if (users.length === 0) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'kP7#mQ9$xL2%vN5&rT8!s', role: 'admin', createdAt: new Date().toISOString() },
        { id: 2, username: 'developer', password: 'bF4@jH6!wK3$nP9%zM1&v', role: 'developer', createdAt: new Date().toISOString() }
      ]
      localStorage.setItem('app_users', JSON.stringify(defaultUsers))
    }
  }, [])

  // Appliquer le mode sombre
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Gérer le scroll du header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHeaderHidden(true)
      } else if (currentScrollY < lastScrollY) {
        setHeaderHidden(false)
      }

      setLastScrollY(currentScrollY)
      setScrolled(currentScrollY > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Vérifier la connexion au serveur au démarrage
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get(`${API_URL.split('/api')[0]}/api/health`)
        setIsConnected(true)
      } catch (error) {
        setIsConnected(false)
        console.error('Erreur de connexion au serveur:', error)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('app_currentUser')
    setCurrentUser(null)
    setCurrentPage('dashboard')
  }

  // Si pas d'utilisateur connecté, afficher la page de login
  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />
  }

  return (
    <div>
      <header className={`header ${headerHidden ? 'header-hidden' : ''}`}>
        <div className="container">
          <h1>📦 Gestionnaire de Stock</h1>
          <div className="nav">
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-link ${currentPage === 'items' ? 'active' : ''}`}
              onClick={() => setCurrentPage('items')}
            >
              📋 Articles
            </button>
            <button
              className={`nav-link ${currentPage === 'lowstock' ? 'active' : ''}`}
              onClick={() => setCurrentPage('lowstock')}
            >
              🚨 Stock Faible
            </button>
            <button
              className={`nav-link ${currentPage === 'statistics' ? 'active' : ''}`}
              onClick={() => setCurrentPage('statistics')}
            >
              📊 Statistiques
            </button>
            <button
              className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
              onClick={() => setCurrentPage('history')}
            >
              📜 Historique
            </button>
            {(currentUser?.role === 'developer' || currentUser?.role === 'admin') && (
              <button
                className={`nav-link ${currentPage === 'developer' ? 'active' : ''}`}
                onClick={() => setCurrentPage('developer')}
                style={{ color: '#3b82f6', fontWeight: 600 }}
              >
                🛠️ Developer
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <span>👤</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{currentUser?.username}</span>
              </div>
              <button
                className="btn btn-small"
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: darkMode ? '#3b82f6' : '#f3f4f6',
                  color: darkMode ? 'white' : '#0f172a',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem'
                }}
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                className="btn btn-small"
                onClick={handleLogout}
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem'
                }}
                title="Déconnexion"
              >
                🚪
              </button>
              <span style={{ fontSize: '0.875rem', color: isConnected ? '#16a34a' : '#dc2626' }}>
                {isConnected ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {!isConnected && (
          <div className="alert alert-danger">
            ⚠️ Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution sur http://localhost:5000
          </div>
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage api={api} />
        )}

        {currentPage === 'items' && (
          <ItemsPage api={api} onMessage={setMessage} />
        )}

        {currentPage === 'lowstock' && (
          <LowStockPage api={api} onMessage={setMessage} />
        )}

        {currentPage === 'statistics' && (
          <StatisticsPage api={api} />
        )}

        {currentPage === 'history' && (
          <HistoryPage api={api} />
        )}

        {currentPage === 'developer' && (currentUser?.role === 'developer' || currentUser?.role === 'admin') && (
          <DeveloperPanel api={api} />
        )}
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>📦 À Propos</h3>
            <p>
              Gestionnaire de Stock est une solution simple et efficace pour gérer votre inventaire en temps réel.
            </p>
          </div>

          <div className="footer-section">
            <h3>🚀 Fonctionnalités</h3>
            <div className="footer-links">
              <a href="#articles">Gestion des articles</a>
              <a href="#lowstock">Alertes de stock</a>
              <a href="#statistics">Statistiques détaillées</a>
              <a href="#history">Historique complet</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>📞 Support</h3>
            <div className="footer-links">
              <a href="mailto:Contact.yoshipro@gmail.com">Contact.yoshipro@gmail.com</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>🔧 Technique</h3>
            <p>
              Construit avec React 18, Vite, Node.js, Express et PostgreSQL.
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Version 1.0.0
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Stock Management. Tous droits réservés.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Politique de confidentialité</a>
            <a href="#terms">Conditions d'utilisation</a>
            <a href="#cookies">Gestion des cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
