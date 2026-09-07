import { useState, useEffect } from 'react'

export default function StatisticsPage({ api }) {
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month') // 'week', 'month', 'all'
  const [statsView, setStatsView] = useState('byItem') // 'byItem', 'byDate'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const response = await api.history.getAll()
      setHistoryData(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les données par période
  const getFilteredData = () => {
    const now = new Date()
    const data = historyData.filter(record => record.action === 'exit')

    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return data.filter(record => new Date(record.created_at) >= weekAgo)
    } else if (period === 'month') {
      const [year, month] = selectedMonth.split('-')
      return data.filter(record => {
        const date = new Date(record.created_at)
        return date.getFullYear() === parseInt(year) && 
               (date.getMonth() + 1) === parseInt(month)
      })
    }
    return data
  }

  // Statistiques par article
  const getStatsByItem = () => {
    const filtered = getFilteredData()
    const itemStats = {}

    filtered.forEach(record => {
      if (!itemStats[record.item_name]) {
        itemStats[record.item_name] = {
          name: record.item_name,
          itemId: record.item_id,
          totalExit: 0,
          count: 0,
          lastDate: null
        }
      }
      itemStats[record.item_name].totalExit += record.quantity
      itemStats[record.item_name].count += 1
      itemStats[record.item_name].lastDate = new Date(record.created_at)
    })

    return Object.values(itemStats)
      .sort((a, b) => b.totalExit - a.totalExit)
  }

  // Statistiques par date
  const getStatsByDate = () => {
    const filtered = getFilteredData()
    const dateStats = {}

    filtered.forEach(record => {
      const date = new Date(record.created_at).toLocaleDateString('fr-FR')
      if (!dateStats[date]) {
        dateStats[date] = {
          date,
          totalExit: 0,
          items: []
        }
      }
      dateStats[date].totalExit += record.quantity
      dateStats[date].items.push({
        name: record.item_name,
        quantity: record.quantity,
        notes: record.notes
      })
    })

    return Object.values(dateStats)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const itemStats = getStatsByItem()
  const dateStats = getStatsByDate()

  // Calculs globaux
  const totalExits = getFilteredData().reduce((sum, record) => sum + record.quantity, 0)
  const uniqueItems = new Set(getFilteredData().map(r => r.item_name)).size
  const averagePerItem = itemStats.length > 0 
    ? Math.round(totalExits / itemStats.length * 10) / 10 
    : 0

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header avec filtres */}
      <div className="section">
        <h2>📊 Statistiques de Sorties</h2>

        {/* Sélecteur de période */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label>Période</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="week">📅 Cette semaine</option>
              <option value="month">📆 Ce mois</option>
              <option value="all">📊 Tous les temps</option>
            </select>
          </div>

          {period === 'month' && (
            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label>Mois</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          )}

          <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label>Vue</label>
            <select value={statsView} onChange={(e) => setStatsView(e.target.value)}>
              <option value="byItem">Par Article</option>
              <option value="byDate">Par Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques globales */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total sorties</h3>
          <div className="value">{totalExits}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            unités sorties
          </p>
        </div>
        <div className="stat-card">
          <h3>Articles sortis</h3>
          <div className="value">{uniqueItems}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            types d'articles
          </p>
        </div>
        <div className="stat-card">
          <h3>Moyenne par article</h3>
          <div className="value">{averagePerItem}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            unités/article
          </p>
        </div>
      </div>

      {/* Vue par Article */}
      {statsView === 'byItem' && (
        <div className="section">
          <h2>📦 Sorties par Article</h2>
          
          {itemStats.length === 0 ? (
            <div className="alert alert-warning">
              ⚠️ Aucune sortie enregistrée pour cette période
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Quantité sortie</th>
                    <th>Nombre d'opérations</th>
                    <th>Dernière sortie</th>
                    <th>Moyenne/opération</th>
                  </tr>
                </thead>
                <tbody>
                  {itemStats.map((stat, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>
                        {stat.name}
                      </td>
                      <td style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>
                        {stat.totalExit} u.
                      </td>
                      <td>
                        {stat.count} {stat.count === 1 ? 'fois' : 'fois'}
                      </td>
                      <td style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {stat.lastDate ? stat.lastDate.toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td style={{ color: '#3b82f6', fontWeight: 600 }}>
                        {(stat.totalExit / stat.count).toFixed(1)} u.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Vue par Date */}
      {statsView === 'byDate' && (
        <div className="section">
          <h2>📅 Sorties par Date</h2>

          {dateStats.length === 0 ? (
            <div className="alert alert-warning">
              ⚠️ Aucune sortie enregistrée pour cette période
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dateStats.map((dayStats, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <h3 style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 700 }}>
                      📅 {dayStats.date}
                    </h3>
                    <div style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      {dayStats.totalExit} u.
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {dayStats.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        style={{
                          background: 'white',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, color: '#0f172a' }}>
                            {item.name}
                          </p>
                          {item.notes && (
                            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              💬 {item.notes}
                            </p>
                          )}
                        </div>
                        <span style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          padding: '0.5rem 0.875rem',
                          borderRadius: '0.375rem',
                          fontWeight: 700
                        }}>
                          -{item.quantity} u.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Résumé mensuel */}
      <div className="section" style={{ marginTop: '2rem' }}>
        <h2>📈 Aperçu Mensuel</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Retrouvez ici les récapitulatifs de sorties pour les 6 derniers mois
        </p>

        {(() => {
          try {
            const now = new Date()
            const monthlyStats = {}

            // Créer les 6 derniers mois
            for (let i = 5; i >= 0; i--) {
              const year = now.getFullYear()
              const month = now.getMonth() - i
              
              // Gérer les mois négatifs (l'année précédente)
              let adjustedYear = year
              let adjustedMonth = month
              
              if (adjustedMonth < 0) {
                adjustedYear = year - 1
                adjustedMonth = 12 + month
              }
              
              const monthKey = `${adjustedYear}-${String(adjustedMonth + 1).padStart(2, '0')}`
              const date = new Date(adjustedYear, adjustedMonth, 1)
              const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
              monthlyStats[monthKey] = { name: monthName, total: 0 }
            }

            // Calculer les totaux
            historyData
              .filter(r => r.action === 'exit')
              .forEach(record => {
                try {
                  const recordDate = new Date(record.created_at)
                  if (!isNaN(recordDate.getTime())) {
                    const monthKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`
                    if (monthlyStats[monthKey]) {
                      monthlyStats[monthKey].total += record.quantity
                    }
                  }
                } catch (e) {
                  console.error('Erreur en traitant la date:', e)
                }
              })

            return (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Total sorties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthlyStats).map(([monthKey, stats]) => (
                      <tr key={monthKey}>
                        <td style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                          {stats.name}
                        </td>
                        <td style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>
                          {stats.total} u.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          } catch (error) {
            console.error('Erreur dans le calcul des statistiques mensuelles:', error)
            return <div className="alert alert-warning">⚠️ Erreur lors du chargement des statistiques mensuelles</div>
          }
        })()}
      </div>
    </div>
  )
}