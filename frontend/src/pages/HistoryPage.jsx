import { useState, useEffect } from 'react'

export default function HistoryPage({ api }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: ''
  })

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await api.history.getAll({
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined
      })
      setHistory(response.data)
    } catch (error) {
      console.error('Erreur:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadHistory()
  }, [filter])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionLabel = (action) => {
    return action === 'entry' ? '📥 Entrée' : '📤 Sortie'
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>📜 Historique du Stock</h2>
        </div>

        <div className="search-bar">
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            placeholder="Date de début"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            placeholder="Date de fin"
          />
          <button className="btn btn-secondary btn-small" onClick={() => setFilter({ startDate: '', endDate: '' })}>
            Réinitialiser
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Chargement...
          </div>
        ) : history.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date/Heure</th>
                  <th>Article</th>
                  <th>Action</th>
                  <th>Quantité</th>
                  <th>Utilisateur</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td>{formatDate(item.timestamp)}</td>
                    <td><strong>{item.item_name}</strong></td>
                    <td>{getActionLabel(item.action)}</td>
                    <td><strong>{item.quantity}</strong></td>
                    <td>{item.username}</td>
                    <td>{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-warning">
            Aucun enregistrement trouvé
          </div>
        )}
      </div>
    </>
  )
}
