import pool from '../db/connection.js';

// GET tous les articles
export const getAllItems = async (req, res) => {
  try {
    const search = req.query.search || '';
    const category = req.query.category || '';

    let query = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET un article par ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST créer un nouvel article
export const createItem = async (req, res) => {
  try {
    const { name, description, quantity, category, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Le nom est obligatoire' });
    }

    const result = await pool.query(
      'INSERT INTO items (name, description, quantity, category, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description || null, quantity || 0, category || null, location || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT mettre à jour un article
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, category, location } = req.body;

    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, quantity = $3, category = $4, location = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, quantity, category, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE supprimer un article
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json({ message: 'Article supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
