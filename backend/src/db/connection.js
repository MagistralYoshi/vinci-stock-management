import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('🔌 Initialisation de la connexion à la base de données...');
console.log(`  DATABASE_URL défini: ${process.env.DATABASE_URL ? 'OUI' : 'NON'}`);

// Create pool based on environment
let pool;
try {
  pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Railway requires SSL
      })
    : new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'stock_management',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
      });
  
  console.log('✅ Pool créé avec succès');
} catch (err) {
  console.error('❌ ERREUR CRITIQUE lors de la création du pool:', err);
  throw err;
}

// Log connection attempts but don't crash
pool.on('error', (err) => {
  console.error('⚠️ Pool error:', err.message);
  // Don't exit - allow server to run without DB initially
});

pool.on('connect', () => {
  console.log('✅ Database connection established');
});

export default pool;
