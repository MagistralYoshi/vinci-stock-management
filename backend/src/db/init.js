import pool from './connection.js';

const initializeDatabase = async () => {
  try {
    console.log('Initialisation de la base de données...');

    // Supprimer les tables existantes pour repartir de zéro
    await pool.query('DROP TABLE IF EXISTS history CASCADE');
    await pool.query('DROP TABLE IF EXISTS items CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');

    // Créer table utilisateurs
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer table articles
    await pool.query(`
      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INTEGER NOT NULL DEFAULT 0,
        category VARCHAR(100),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer table historique
    await pool.query(`
      CREATE TABLE history (
        id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        notes TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer les indexes
    await pool.query('CREATE INDEX idx_items_name ON items(name)');
    await pool.query('CREATE INDEX idx_items_category ON items(category)');
    await pool.query('CREATE INDEX idx_history_item_id ON history(item_id)');
    await pool.query('CREATE INDEX idx_history_timestamp ON history(timestamp)');

    // Insérer l'utilisateur admin
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      ['admin', 'admin@localhost', 'hashed_password']
    );

    console.log('✅ Base de données initialisée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

initializeDatabase();
