import { useState } from 'react'

export default function ItemList({ items, onEdit, onDelete, onRecordAction }) {
  const [actioningItemId, setActioningItemId] = useState(null)
  const [actionData, setActionData] = useState({ action: 'exit', quantity: 1, notes: '' })

  const handleRecordAction = async () => {
    if (actionData.quantity <= 0) {
      alert('La quantité doit être positive')
      return
    }
    await onRecordAction(actioningItemId, actionData.action, actionData.quantity, actionData.notes)
    setActioningItemId(null)
    setActionData({ action: 'exit', quantity: 1, notes: '' })
  }

  if (items.length === 0) {
    return (
      <div className="alert alert-warning">
        ⚠️ Aucun article trouvé. Commencez par en ajouter un !
      </div>
    )
  }

  return (
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

          <div className="quantity-display">
            <p>Stock actuel</p>
            <div className="value" style={{ color: item.quantity > 0 ? '#3b82f6' : '#ef4444' }}>
              {item.quantity}
            </div>
          </div>

          {actioningItemId === item.id ? (
            <div style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f0fdf4', borderRadius: '0.75rem' }}>
              <div className="form-group">
                <label>Action</label>
                <select
                  value={actionData.action}
                  onChange={(e) => setActionData({ ...actionData, action: e.target.value })}
                >
                  <option value="entry">📥 Entrée</option>
                  <option value="exit">📤 Sortie</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantité</label>
                <input
                  type="number"
                  min="1"
                  value={actionData.quantity}
                  onChange={(e) => setActionData({ ...actionData, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Notes (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Projet A, Maintenance..."
                  value={actionData.notes}
                  onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                />
              </div>

              <div className="btn-group">
                <button className="btn btn-success" onClick={handleRecordAction}>
                  ✓ Enregistrer
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
                className="btn btn-warning btn-small"
                onClick={() => setActioningItemId(item.id)}
              >
                📤 Entrée/Sortie
              </button>
              <button
                className="btn btn-primary btn-small"
                onClick={() => onEdit(item)}
              >
                ✏️ Modifier
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => onDelete(item.id)}
              >
                🗑️ Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
