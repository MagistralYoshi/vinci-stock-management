import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import historyRoutes from './routes/history.js';
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
