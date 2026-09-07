import { useState, useEffect } from 'react'

export default function LowStockPage({ api, onMessage }) {
  const [items, setItems] = useState([])
  const [lowStockThreshold, setLowStockThreshold] = useState(5)
  const [loading, setLoading] = useState(true)
  const [actioningItemId, setActioningItemId] = useState(null)
  const [actionData, setActionData] = useState({ quantity: 1, notes: '' })

  // Charger les articles
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const response = await api.items.getAll()
      // Filtrer les articles avec stock faible
      const lowStockItems = response.data.filter(item => item.quantity < lowStockThreshold)
      setItems(lowStockItems)
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
      onMessage({ type: 'danger', text: '❌ Erreur lors du chargement des articles' })
    } finally {
      setLoading(false)
    }
  }

  const handleThresholdChange = async () => {
    try {
      setLoading(true)
      const response = await api.items.getAll()
      const lowStockItems = response.data.filter(item => item.quantity < lowStockThreshold)
      setItems(lowStockItems)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du seuil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordAction = async () => {
    if (actionData.quantity <= 0) {
      onMessage({ type: 'warning', text: '⚠️ La quantité doit être positive' })
      return
    }

    try {
      await api.history.recordAction({
        action: 'entry',
        quantity: parseInt(actionData.quantity),
        itemId: actioningItemId,
        notes: actionData.notes
      })

      onMessage({ type: 'success', text: '✅ Stock ajouté avec succès' })
      setActioningItemId(null)
      setActionData({ quantity: 1, notes: '' })
      
      // Recharger les articles
      loadItems()
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error)
      onMessage({ type: 'danger', text: '❌ Erreur lors de l\'ajout du stock' })
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    )
  }

  // Statistiques
  const totalLowStockItems = items.length
  const totalLowStockQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div>
      {/* Configuration du seuil */}
      <div className="section">
        <h2>🚨 Articles à Faible Stock</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Articles en-dessous du seuil</h3>
            <div className="value">{totalLowStockItems}</div>
          </div>
          <div className="stat-card">
            <h3>Quantité totale à faible stock</h3>
            <div className="value">{totalLowStockQuantity}</div>
          </div>
          <div className="stat-card">
            <h3>Seuil d'alerte actuel</h3>
            <div className="value">{lowStockThreshold}</div>
          </div>
        </div>

        <div className="form-group">
          <label>Définir le seuil d'alerte (unités)</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleThresholdChange}>
              Mettre à jour
            </button>
          </div>
        </div>
      </div>

      {/* Affichage des articles à faible stock */}
      {items.length === 0 ? (
        <div className="alert alert-success">
          ✅ Excellent ! Tous les articles sont au-dessus du seuil de {lowStockThreshold} unités.
        </div>
      ) : (
        <div className="grid">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              
              {item.description && (
                <p style={{ marginBottom: '1rem' }}>{item.description}</p>
              )}

              <div style={{ marginBottom: '1rem' }}>
                {item.category && (
                  <span className="badge badge-category">🏷️ {item.category}</span>
                )}
                {item.location && (
                  <span className="badge badge-location">📍 {item.location}</span>
                )}
              </div>

              {/* Affichage du stock avec alerte visuelle */}
              <div style={{
                background: item.quantity === 0 ? '#fee2e2' : '#fef3c7',
                padding: '1rem',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                textAlign: 'center',
                border: item.quantity === 0 ? '2px solid #ef4444' : '2px solid #f59e0b'
              }}>
                <p style={{ color: item.quantity === 0 ? '#7f1d1d' : '#92400e', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {item.quantity === 0 ? '🔴 RUPTURE DE STOCK' : '🟡 STOCK FAIBLE'}
                </p>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: item.quantity === 0 ? '#ef4444' : '#f59e0b' }}>
                  {item.quantity}
                </div>
              </div>

              {actioningItemId === item.id ? (
                <div style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f0fdf4', borderRadius: '0.75rem' }}>
                  <div className="form-group">
                    <label>Quantité à ajouter</label>
                    <input
                      type="number"
                      min="1"
                      value={actionData.quantity}
                      onChange={(e) => setActionData({ ...actionData, quantity: e.target.value })}
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label>Notes (optionnel)</label>
                    <input
                      type="text"
                      placeholder="Ex: Achat fournisseur..."
                      value={actionData.notes}
                      onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                    />
                  </div>

                  <div className="btn-group">
                    <button className="btn btn-success" onClick={handleRecordAction}>
                      ✓ Ajouter au stock
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setActioningItemId(null)}
                    >
                      ✕ Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    onClick={() => setActioningItemId(item.id)}
                  >
                    📥 Ajouter au stock
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}