import { useState, useEffect } from 'react'

export default function DashboardPage({ api }) {
  const [items, setItems] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [itemsRes, historyRes] = await Promise.all([
        api.items.getAll(),
        api.history.getAll()
      ])
      setItems(itemsRes.data)
      setHistory(historyRes.data)
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    )
  }

  // Calculs
  const lowStockItems = items.filter(item => item.quantity < 5)
  const outOfStockItems = items.filter(item => item.quantity === 0)
  const totalItems = items.length
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalExits = history.filter(h => h.action === 'exit').reduce((sum, h) => sum + h.quantity, 0)
  const recentHistory = history.slice(0, 10)

  return (
    <div>
      {/* Header du Dashboard */}
      <div className="section">
        <h2>📊 Dashboard - Vue d'ensemble</h2>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Récapitulatif en temps réel de votre gestion de stock
        </p>
      </div>

      {/* KPIs principaux */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📦 Articles en stock</h3>
          <div className="value">{totalItems}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            références
          </p>
        </div>

        <div className="stat-card">
          <h3>📊 Stock total</h3>
          <div className="value">{totalStock}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            unités
          </p>
        </div>

        <div className="stat-card">
          <h3>📤 Total sortis</h3>
          <div className="value">{totalExits}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            unités sorties
          </p>
        </div>

        <div className="stat-card" style={{ borderTopColor: '#f59e0b' }}>
          <h3>🚨 Stock faible</h3>
          <div className="value" style={{ color: '#f59e0b' }}>{lowStockItems.length}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            articles à {'<'} 5u
          </p>
        </div>

        <div className="stat-card" style={{ borderTopColor: '#ef4444' }}>
          <h3>🔴 Rupture</h3>
          <div className="value" style={{ color: '#ef4444' }}>{outOfStockItems.length}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            articles = 0
          </p>
        </div>

        <div className="stat-card">
          <h3>📈 Taux de rotation</h3>
          <div className="value">
            {totalItems > 0 
              ? Math.round((totalExits / totalStock) * 100) 
              : 0}%
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            sorties/stock
          </p>
        </div>
      </div>

      {/* Alertes importants */}
      {outOfStockItems.length > 0 && (
        <div className="section">
          <h2>🔴 Ruptures de Stock</h2>
          <div className="grid">
            {outOfStockItems.map(item => (
              <div key={item.id} className="item-card" style={{ borderLeftColor: '#ef4444', borderLeftWidth: '4px' }}>
                <h3>{item.name}</h3>
                <p style={{ color: '#ef4444', fontWeight: 700, marginBottom: '1rem' }}>
                  ⚠️ RUPTURE DE STOCK
                </p>
                {item.description && <p>{item.description}</p>}
                <div style={{ marginTop: '1rem' }}>
                  {item.category && <span className="badge badge-category">{item.category}</span>}
                  {item.location && <span className="badge badge-location">{item.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div className="section">
          <h2>🟡 Stock Faible ({'<'} 5 unités)</h2>
          <div className="grid">
            {lowStockItems.map(item => (
              <div key={item.id} className="item-card" style={{ borderLeftColor: '#f59e0b', borderLeftWidth: '4px' }}>
                <h3>{item.name}</h3>
                <p style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '1rem' }}>
                  Stock: {item.quantity} u.
                </p>
                {item.description && <p>{item.description}</p>}
                <div style={{ marginTop: '1rem' }}>
                  {item.category && <span className="badge badge-category">{item.category}</span>}
                  {item.location && <span className="badge badge-location">{item.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mouvements récents */}
      <div className="section">
        <h2>📜 Mouvements Récents</h2>
        
        {recentHistory.length === 0 ? (
          <div className="alert alert-warning">
            ℹ️ Aucun mouvement enregistré
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Action</th>
                  <th>Quantité</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.map((record, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{record.item_name}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: record.action === 'entry' ? '#d1fae5' : '#fee2e2',
                        color: record.action === 'entry' ? '#065f46' : '#991b1b'
                      }}>
                        {record.action === 'entry' ? '📥 Entrée' : '📤 Sortie'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: record.action === 'entry' ? '#10b981' : '#ef4444' }}>
                      {record.action === 'entry' ? '+' : '-'}{record.quantity}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {(() => {
                        try {
                          const dateStr = record.timestamp || record.created_at || new Date().toISOString();
                          const date = new Date(dateStr);
                          if (isNaN(date.getTime())) return '—';
                          return `${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
                        } catch (e) {
                          console.error('Date parse error:', record, e);
                          return '—';
                        }
                      })()}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}