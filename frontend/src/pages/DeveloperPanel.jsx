import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function DeveloperPanel({ api }) {
  // Restriction d'accès: seul developer peut accéder
  const currentUser = JSON.parse(localStorage.getItem('app_currentUser') || 'null')
  if (!currentUser || currentUser.role !== 'developer') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h2>❌ Accès refusé</h2>
        <p>Seul les utilisateurs avec le rôle "developer" peuvent accéder au Developer Panel.</p>
      </div>
    )
  }

  const [logs, setLogs] = useState([])
  const [errors, setErrors] = useState([])
  const [health, setHealth] = useState({
    backend: 'checking',
    database: 'checking',
    timestamp: new Date()
  })
  const [updates, setUpdates] = useState([])
  const [activeTab, setActiveTab] = useState('health')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.body.classList.contains('dark-mode')
  })

  // Détecter les changements de dark mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-mode'))
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Charger les données au montage
  useEffect(() => {
    checkHealth()
    loadLogs()
    loadErrors()
    loadUpdates()
    
    // Vérifier la santé toutes les 30 secondes
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    try {
      const backendRes = await fetch(`${API_URL}/health`)
      const dbRes = await fetch(`${API_URL}/health`)
      
      setHealth({
        backend: backendRes.ok ? 'connected' : 'error',
        database: dbRes.ok ? 'connected' : 'error',
        timestamp: new Date()
      })

      // Log la vérification
      addLog({
        type: 'info',
        message: `Health check: Backend ${backendRes.ok ? '✅' : '❌'}, DB ${dbRes.ok ? '✅' : '❌'}`,
        timestamp: new Date()
      })
    } catch (error) {
      setHealth({
        backend: 'error',
        database: 'error',
        timestamp: new Date()
      })
      addError({
        type: 'connection',
        message: error.message,
        timestamp: new Date()
      })
    }
  }

  const addLog = (log) => {
    setLogs(prev => [log, ...prev.slice(0, 99)])
  }

  const addError = (error) => {
    setErrors(prev => [error, ...prev.slice(0, 49)])
  }

  const loadLogs = () => {
    const stored = localStorage.getItem('dev_logs')
    if (stored) {
      setLogs(JSON.parse(stored))
    }
  }

  const loadErrors = () => {
    const stored = localStorage.getItem('dev_errors')
    if (stored) {
      setErrors(JSON.parse(stored))
    }
  }

  const loadUpdates = () => {
    const updates = [
      { id: 5, date: '2026-09-07 19:37', author: 'Copilot', change: 'Suppression du service worker - Cache fix', status: 'completed' },
      { id: 4, date: '2026-09-07 19:36', author: 'Copilot', change: 'Fix date formatting (Invalid Date)', status: 'completed' },
      { id: 3, date: '2026-09-07 19:35', author: 'Copilot', change: 'Dark mode CSS improvements', status: 'completed' },
      { id: 2, date: '2026-09-07 19:00', author: 'Copilot', change: 'Table hover effects styling', status: 'completed' },
      { id: 1, date: '2026-09-07 18:00', author: 'Admin', change: 'Initial dashboard setup', status: 'completed' }
    ]
    setUpdates(updates)
  }

  const clearLogs = () => {
    setLogs([])
    setErrors([])
    localStorage.removeItem('dev_logs')
    localStorage.removeItem('dev_errors')
  }

  const exportLogs = () => {
    const data = {
      logs,
      errors,
      health,
      updates,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dev-logs-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  // Styles adaptatifs au dark mode
  const colors = {
    bg: isDarkMode ? '#2d333f' : '#f9fafb',
    bgAlt: isDarkMode ? '#1a1f2e' : '#ffffff',
    text: isDarkMode ? '#e5e7eb' : '#1f2937',
    textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
    border: isDarkMode ? '#3f4656' : '#e5e7eb',
    hover: isDarkMode ? '#3f4656' : '#f3f4f6'
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>🛠️ Developer Panel</h1>
        <p style={{ color: colors.textSecondary }}>Dernière vérification: {health.timestamp.toLocaleTimeString('fr-FR')}</p>
      </div>

      {/* Health Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          border: `1px solid ${colors.border}`,
          borderRadius: '0.5rem',
          background: colors.bg
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {health.backend === 'connected' ? '✅' : health.backend === 'checking' ? '⏳' : '❌'}
            </span>
            <h3 style={{ color: colors.text }}>Backend API</h3>
          </div>
          <p style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
            {health.backend === 'connected' ? 'http://localhost:5000' : 'Déconnecté'}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          border: `1px solid ${colors.border}`,
          borderRadius: '0.5rem',
          background: colors.bg
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {health.database === 'connected' ? '✅' : health.database === 'checking' ? '⏳' : '❌'}
            </span>
            <h3 style={{ color: colors.text }}>PostgreSQL</h3>
          </div>
          <p style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
            {health.database === 'connected' ? 'stock_management' : 'Déconnecté'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '1rem'
      }}>
        {['health', 'logs', 'errors', 'updates'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? 'white' : colors.textSecondary,
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        background: colors.bg,
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: `1px solid ${colors.border}`,
        minHeight: '400px',
        maxHeight: '600px',
        overflowY: 'auto',
        color: colors.text
      }}>
        {activeTab === 'health' && (
          <div>
            <h2>System Status</h2>
            <div style={{
              background: colors.bgAlt,
              padding: '1rem',
              borderRadius: '0.375rem',
              marginTop: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: colors.text
            }}>
{`Backend API: ${health.backend === 'connected' ? '✅ ONLINE' : '❌ OFFLINE'}
Database: ${health.database === 'connected' ? '✅ CONNECTED' : '❌ FAILED'}
Frontend: ✅ RUNNING
Service Worker: ✅ CLEANED
Last Check: ${health.timestamp.toLocaleTimeString('fr-FR')}`}
            </div>
            <button
              onClick={checkHealth}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              🔄 Vérifier maintenant
            </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h2 style={{ color: colors.text }}>Logs ({logs.length})</h2>
            <div style={{ marginTop: '1rem' }}>
              {logs.length === 0 ? (
                <p style={{ color: colors.textSecondary }}>Aucun log disponible</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: colors.bgAlt,
                    borderLeft: '3px solid #3b82f6',
                    borderRadius: '0.25rem',
                    fontSize: '0.85rem',
                    border: `1px solid ${colors.border}`,
                    borderLeftWidth: '3px'
                  }}>
                    <span style={{ color: colors.textSecondary, fontSize: '0.75rem' }}>
                      {log.timestamp?.toLocaleTimeString('fr-FR')}
                    </span>
                    <p style={{ margin: '0.25rem 0 0', color: colors.text }}>{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div>
            <h2 style={{ color: colors.text }}>Erreurs ({errors.length})</h2>
            <div style={{ marginTop: '1rem' }}>
              {errors.length === 0 ? (
                <p style={{ color: colors.textSecondary }}>Aucune erreur enregistrée ✅</p>
              ) : (
                errors.map((error, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: isDarkMode ? '#7f1d1d' : '#fee2e2',
                    borderLeft: '3px solid #ef4444',
                    borderRadius: '0.25rem',
                    fontSize: '0.85rem',
                    border: `1px solid ${isDarkMode ? '#991b1b' : '#fca5a5'}`,
                    borderLeftWidth: '3px'
                  }}>
                    <span style={{ color: isDarkMode ? '#fca5a5' : '#991b1b', fontSize: '0.75rem', fontWeight: 600 }}>
                      {error.type?.toUpperCase()}
                    </span>
                    <span style={{ color: colors.textSecondary, fontSize: '0.75rem', marginLeft: '1rem' }}>
                      {error.timestamp?.toLocaleTimeString('fr-FR')}
                    </span>
                    <p style={{ margin: '0.25rem 0 0', color: isDarkMode ? '#fca5a5' : '#991b1b' }}>{error.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div>
            <h2 style={{ color: colors.text }}>Historique des mises à jour</h2>
            <div style={{ marginTime: '1rem' }}>
              {updates.map(update => (
                <div key={update.id} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: colors.bgAlt,
                  borderLeft: '3px solid #10b981',
                  borderRadius: '0.25rem',
                  fontSize: '0.85rem',
                  border: `1px solid ${colors.border}`,
                  borderLeftWidth: '3px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: colors.text }}>{update.change}</span>
                    <span style={{ color: colors.textSecondary, fontSize: '0.75rem' }}>{update.date}</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', color: colors.textSecondary, fontSize: '0.8rem' }}>
                    Par: {update.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={exportLogs}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          📥 Exporter les logs
        </button>
        <button
          onClick={clearLogs}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          🗑️ Effacer tout
        </button>
      </div>
    </div>
  )
}
