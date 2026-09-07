import { useState } from 'react'

export default function ItemForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(item || {
    name: '',
    description: '',
    quantity: 0,
    category: '',
    location: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Le nom de l\'article est obligatoire')
      return
    }
    onSubmit(formData)
    if (!item) {
      setFormData({
        name: '',
        description: '',
        quantity: 0,
        category: '',
        location: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label>Nom de l'article *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Perceuse, Béton, etc."
            required
          />
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ex: Outils, Matériaux, etc."
          />
        </div>

        <div className="form-group">
          <label>Localisation</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ex: Hangar A, Étagère 1, etc."
          />
        </div>

        <div className="form-group">
          <label>Quantité</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description supplémentaire..."
          rows="3"
        />
      </div>

      <div className="btn-group">
        <button type="submit" className="btn btn-primary">
          {item ? '✓ Mettre à jour' : '✓ Ajouter l\'article'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
