import pool from '../db/connection.js';

// GET historique complet
export const getHistory = async (req, res) => {
  try {
    const { itemId, userId, startDate, endDate } = req.query;

    let query = `
      SELECT h.*, i.name as item_name, u.username 
      FROM history h
      JOIN items i ON h.item_id = i.id
      JOIN users u ON h.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (itemId) {
      query += ' AND h.item_id = $' + (params.length + 1);
      params.push(itemId);
    }

    if (userId) {
      query += ' AND h.user_id = $' + (params.length + 1);
      params.push(userId);
    }

    if (startDate) {
      query += ' AND h.timestamp >= $' + (params.length + 1);
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND h.timestamp <= $' + (params.length + 1);
      params.push(endDate);
    }

    query += ' ORDER BY h.timestamp DESC LIMIT 500';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET historique d'un article
export const getItemHistory = async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await pool.query(
      `
      SELECT h.*, u.username
      FROM history h
      JOIN users u ON h.user_id = u.id
      WHERE h.item_id = $1
      ORDER BY h.timestamp DESC
      LIMIT 100
      `,
      [itemId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST enregistrer une action (entrée/sortie)
export const recordAction = async (req, res) => {
  try {
    const { itemId, action, quantity, notes } = req.body;

    if (!itemId || !action || quantity === undefined) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Utiliser l'utilisateur admin par défaut (ID 1)
    const userId = 1;

    // Enregistrer l'action
    const historyResult = await pool.query(
      'INSERT INTO history (item_id, user_id, action, quantity, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [itemId, userId, action, quantity, notes || null]
    );

    // Mettre à jour la quantité de l'article
    let quantityChange = 0;
    if (action === 'entry') {
      quantityChange = quantity;
    } else if (action === 'exit') {
      quantityChange = -quantity;
    }

    await pool.query(
      'UPDATE items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantityChange, itemId]
    );

    res.status(201).json(historyResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
