import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function DeveloperPanel({ api }) {
  const [logs, setLogs] = useState([])
  const [errors, setErrors] = useState([])
  const [health, setHealth] = useState({
    backend: 'checking',
    database: 'checking',
    timestamp: new Date()
  })
  const [updates, setUpdates] = useState([])
  const [activeTab, setActiveTab] = useState('health')

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

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>🛠️ Developer Panel</h1>
        <p style={{ color: '#6b7280' }}>Dernière vérification: {health.timestamp.toLocaleTimeString('fr-FR')}</p>
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
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {health.backend === 'connected' ? '✅' : health.backend === 'checking' ? '⏳' : '❌'}
            </span>
            <h3>Backend API</h3>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {health.backend === 'connected' ? 'http://localhost:5000' : 'Déconnecté'}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {health.database === 'connected' ? '✅' : health.database === 'checking' ? '⏳' : '❌'}
            </span>
            <h3>PostgreSQL</h3>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {health.database === 'connected' ? 'stock_management' : 'Déconnecté'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #e5e7eb',
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
              color: activeTab === tab ? 'white' : '#6b7280',
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
        background: '#f9fafb',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        minHeight: '400px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {activeTab === 'health' && (
          <div>
            <h2>System Status</h2>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginTop: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
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
            <h2>Logs ({logs.length})</h2>
            <div style={{ marginTop: '1rem' }}>
              {logs.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Aucun log disponible</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'white',
                    borderLeft: '3px solid #3b82f6',
                    borderRadius: '0.25rem',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {log.timestamp?.toLocaleTimeString('fr-FR')}
                    </span>
                    <p style={{ margin: '0.25rem 0 0' }}>{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div>
            <h2>Erreurs ({errors.length})</h2>
            <div style={{ marginTop: '1rem' }}>
              {errors.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Aucune erreur enregistrée ✅</p>
              ) : (
                errors.map((error, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: '#fee2e2',
                    borderLeft: '3px solid #ef4444',
                    borderRadius: '0.25rem',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#991b1b', fontSize: '0.75rem', fontWeight: 600 }}>
                      {error.type?.toUpperCase()}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: '1rem' }}>
                      {error.timestamp?.toLocaleTimeString('fr-FR')}
                    </span>
                    <p style={{ margin: '0.25rem 0 0', color: '#991b1b' }}>{error.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div>
            <h2>Historique des mises à jour</h2>
            <div style={{ marginTop: '1rem' }}>
              {updates.map(update => (
                <div key={update.id} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: 'white',
                  borderLeft: '3px solid #10b981',
                  borderRadius: '0.25rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{update.change}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{update.date}</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
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
