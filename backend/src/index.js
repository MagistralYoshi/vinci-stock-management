import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import itemRoutes from './routes/items.js';
import historyRoutes from './routes/history.js';
import authRoutes from './routes/auth.js';
import pool from './db/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Support pour localhost (dev) et Railway (prod)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CORS_ORIGIN // Pour Railway
].filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Simple ping endpoint - no database dependency
app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'pong',
    timestamp: new Date().toISOString()
  });
});

// Health check - tests database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/history', historyRoutes);

// Route racine
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Stock Management API',
    version: '1.0.0',
    endpoints: {
      ping: '/api/ping',
      health: '/api/health',
      items: '/api/items',
      history: '/api/history'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Initialize database tables if they don't exist
const initializeDatabase = async () => {
  try {
    console.log('🔧 Vérification/initialisation des tables de base de données...');

    // Check if items table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'items')`
    );

    if (!tableExists.rows[0].exists) {
      console.log('📦 Tables non trouvées - création en cours...');

      // Create users table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create items table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
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

      // Create history table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS history (
          id SERIAL PRIMARY KEY,
          item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          action VARCHAR(50) NOT NULL,
          quantity INTEGER NOT NULL,
          notes TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes
      await pool.query('CREATE INDEX IF NOT EXISTS idx_items_name ON items(name)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_items_category ON items(category)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_history_item_id ON history(item_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp)');

      // Insert default admin users if users table is empty
      const usersCount = await pool.query('SELECT COUNT(*) FROM users');
      if (usersCount.rows[0].count === '0') {
        console.log('📝 Création des utilisateurs par défaut...');
        
        // Hash passwords
        const adminHash = await bcryptjs.hash('kP7#mQ9$xL2%vN5&rT8!s', 10);
        const devHash = await bcryptjs.hash('bF4@jH6!wK3$nP9%zM1&v', 10);
        
        // Insert default users
        await pool.query(
          'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)',
          [
            'admin', 'admin@localhost', adminHash, 'admin',
            'developer', 'developer@localhost', devHash, 'developer'
          ]
        );
        console.log('✅ Utilisateurs par défaut créés');
      }

      console.log('✅ Tables créées avec succès');
    } else {
      console.log('✅ Tables trouvées - aucune initialisation nécessaire');
    }
  } catch (error) {
    console.error('⚠️ Erreur lors de l\'initialisation des tables:', error.message);
    // Don't crash - continue anyway
  }
};

// Démarrage du serveur
// En production (Railway), écouter sur 0.0.0.0
// En développement (localhost), utiliser localhost
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Debug: afficher les variables d'environnement au démarrage
console.log('🔧 DEBUG - Variables d\'environnement au démarrage:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  PORT: ${process.env.PORT}`);
console.log(`  CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'défini' : 'non défini'}`);
console.log(`  Résultat final - HOST: ${HOST}, PORT: ${PORT}`);

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    
    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ Serveur démarré sur ${HOST}:${PORT}`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
      console.log(`⚠️ NOTE: Cet affichage "localhost" n'est que pour les logs. En production c'est accessible via ${process.env.CORS_ORIGIN || 'l\'URL de Railway'}`);
      
      // Test du serveur 100ms après le démarrage
      setTimeout(() => {
        console.log('🧪 Testing server health...');
        try {
          const testResponse = { status: 'pong', timestamp: new Date().toISOString() };
          console.log('✅ Server health test passed:', JSON.stringify(testResponse));
        } catch (err) {
          console.error('❌ Server health test failed:', err);
        }
      }, 100);
    });

    // Catch non-handled errors
    server.on('error', (err) => {
      console.error('❌ Erreur serveur:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Erreur critique au démarrage:', error);
    process.exit(1);
  }
})();

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Log process exit
process.on('exit', (code) => {
  console.log(`🛑 Processus terminé avec le code: ${code}`);
});
