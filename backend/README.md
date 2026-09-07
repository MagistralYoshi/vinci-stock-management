# Backend - Stock Management API

API REST complète pour gérer le stock de matériel en temps réel.

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Modifiez les paramètres de base de données dans .env

# Initialisation de la base de données
npm run db:init

# Lancer le serveur en développement
npm run dev
```

L'API sera disponible sur `http://localhost:5000`

## 📚 Documentation de l'API

Voir [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) pour tous les endpoints disponibles.

## 🏗️ Architecture

```
src/
├── index.js              # Point d'entrée principal
├── db/
│   ├── connection.js     # Configuration PostgreSQL
│   └── init.js           # Script d'initialisation
├── routes/
│   ├── items.js          # Routes CRUD pour les articles
│   └── history.js        # Routes pour l'historique
└── controllers/
    ├── itemController.js  # Logique métier articles
    └── historyController.js # Logique métier historique
```

## 📦 Dépendances

- **express** : Framework web
- **pg** : Driver PostgreSQL
- **dotenv** : Gestion des variables d'environnement
- **cors** : Gestion des CORS
- **jsonwebtoken** : Authentification (prêt pour futur usage)
- **bcryptjs** : Hashage des mots de passe (prêt pour futur usage)

## 🔧 Variables d'Environnement

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stock_management
DB_USER=stock_user
DB_PASSWORD=your_password

# Sécurité
JWT_SECRET=your_secret_key_change_this

# Serveur
NODE_ENV=development
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Démarrer en développement avec auto-reload
npm start        # Démarrer le serveur
npm run db:init  # Initialiser la base de données
```

## 🗄️ Base de Données

La base de données PostgreSQL est automatiquement créée avec les tables suivantes :
- `users` : Utilisateurs du système
- `items` : Articles du stock
- `history` : Historique des mouvements

### Initialisation Manuelle

Si vous besoin de réinitialiser la base de données :

```bash
npm run db:init
```

## 🚨 Dépannage

### Erreur de connexion PostgreSQL

```
error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions :**
1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez les paramètres de connexion dans `.env`
3. Vérifiez que la base de données existe

### Port déjà utilisé

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution :** Modifiez `PORT` dans `.env`

## 🔐 Sécurité

⚠️ **À compléter :**
- [ ] Implémentation de l'authentification JWT
- [ ] Validation des entrées
- [ ] Rate limiting
- [ ] HTTPS en production
- [ ] Gestion des rôles et permissions

## 📈 Performances

Indexes créés automatiquement sur :
- `items.name` : Recherche rapide
- `items.category` : Filtrage rapide
- `history.item_id` : Requêtes historique
- `history.timestamp` : Filtrage par date

## 🚀 Déploiement Production

Pour déployer en production :

1. Configurez les variables d'environnement
2. Utilisez une base de données PostgreSQL
