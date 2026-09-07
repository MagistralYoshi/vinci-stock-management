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
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});
