import { useState, useEffect } from 'react'
import ItemList from '../components/ItemList'
import ItemForm from '../components/ItemForm'

export default function ItemsPage({ api, onMessage }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  // Charger les articles
  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await api.items.getAll({ search, category: filter })
      setItems(response.data)
    } catch (error) {
      onMessage({ type: 'danger', text: 'Erreur lors du chargement des articles' })
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [search, filter])

  const handleAddItem = async (formData) => {
    try {
      await api.items.create(formData)
      onMessage({ type: 'success', text: 'Article ajouté avec succès' })
      setShowForm(false)
      loadItems()
    } catch (error) {
      onMessage({ type: 'danger', text: 'Erreur lors de l\'ajout de l\'article' })
    }
  }

  const handleUpdateItem = async (id, formData) => {
    try {
      await api.items.update(id, formData)
      onMessage({ type: 'success', text: 'Article mis à jour' })
      setEditingItem(null)
      loadItems()
    } catch (error) {
      onMessage({ type: 'danger', text: 'Erreur lors de la mise à jour' })
    }
  }

  const handleDeleteItem = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    try {
      await api.items.delete(id)
      onMessage({ type: 'success', text: 'Article supprimé' })
      loadItems()
    } catch (error) {
      onMessage({ type: 'danger', text: 'Erreur lors de la suppression' })
    }
  }

  const handleRecordAction = async (itemId, action, quantity, notes) => {
    try {
      // L'utilisateur par défaut est géré côté backend
      await api.history.recordAction({
        itemId,
        action,
        quantity: parseInt(quantity),
        notes
      })
      onMessage({ type: 'success', text: `Sortie enregistrée` })
      loadItems()
    } catch (error) {
      onMessage({ type: 'danger', text: 'Erreur lors de l\'enregistrement' })
    }
  }

  // Obtenir les catégories uniques
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>📋 Gestion des Articles</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Ajouter un article'}
          </button>
        </div>

        {showForm && (
          <ItemForm
            onSubmit={handleAddItem}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      {editingItem && (
        <div className="card">
          <div className="card-header">
            <h2>✏️ Modifier l'article</h2>
            <button className="btn btn-secondary" onClick={() => setEditingItem(null)}>
              Annuler
            </button>
          </div>
          <ItemForm
            item={editingItem}
            onSubmit={(data) => handleUpdateItem(editingItem.id, data)}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>📦 Inventaire</h2>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Chargement...
          </div>
        ) : (
          <ItemList
            items={items}
            onEdit={setEditingItem}
            onDelete={handleDeleteItem}
            onRecordAction={handleRecordAction}
          />
        )}
      </div>
    </>
  )
}
