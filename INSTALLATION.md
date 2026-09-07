# Installation et Guide de Démarrage

## 📋 Prérequis

Avant de commencer, assurez-vous que vous avez installé :

- **Node.js** 16+ ([télécharger](https://nodejs.org/))
- **PostgreSQL** 12+ ([télécharger](https://www.postgresql.org/download/))
- **Git** (optionnel)

## 🚀 Installation Étape par Étape

### 1️⃣ Configuration de la Base de Données PostgreSQL

#### Sur Windows :

1. Ouvrez l'application **pgAdmin** ou utilisez le terminal PostgreSQL
2. Créez une base de données :
```sql
CREATE DATABASE stock_management;
CREATE USER stock_user WITH PASSWORD 'your_password';
ALTER ROLE stock_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE stock_management TO stock_user;
```

Ou via ligne de commande (psql) :
```bash
psql -U postgres
CREATE DATABASE stock_management;
CREATE USER stock_user WITH PASSWORD 'your_password';
ALTER ROLE stock_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE stock_management TO stock_user;
\q
```

### 2️⃣ Installation du Backend

```bash
# Allez dans le dossier backend
cd backend

# Installez les dépendances
npm install

# Créez le fichier .env avec vos paramètres
cp .env.example .env
```

**Modifiez le fichier `backend/.env` :**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stock_management
DB_USER=stock_user
DB_PASSWORD=your_password  # Remplacez par le mot de passe créé

JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Initialisez la base de données :**
```bash
npm run db:init
```

Vous devriez voir : ✅ Base de données initialisée avec succès

**Démarrez le serveur :**
```bash
npm run dev
```

Le serveur devrait afficher :
```
✅ Serveur démarré sur http://localhost:5000
📚 API docs: http://localhost:5000/api
```

### 3️⃣ Installation du Frontend

Dans un **nouveau terminal** :

```bash
# Allez dans le dossier frontend
cd frontend

# Installez les dépendances
npm install

# Démarrez le serveur de développement
npm run dev
```

Le frontend devrait afficher :
```
VITE v5.0.8  ready in ... ms
➜  Local:   http://localhost:5173/
```

### 4️⃣ Accès à l'Application

Ouvrez votre navigateur et allez à : **http://localhost:5173/**

## ✨ Fonctionnalités Principales

### 📋 Page Articles
- ➕ **Ajouter des articles** avec nom, catégorie, localisation, description
- 🔍 **Rechercher et filtrer** par nom ou catégorie
- ✏️ **Modifier** un article existant
- 🗑️ **Supprimer** un article
- 📥 **Enregistrer une entrée** (ajout de stock)
- 📤 **Enregistrer une sortie** (retrait de stock)

### 📜 Page Historique
- 📅 **Voir tout l'historique** des mouvements de stock
- 🔍 **Filtrer par date** (date de début et fin)
- 👤 **Voir qui a effectué l'action**
- 📝 **Consulter les notes** associées à chaque mouvement

## 🆘 Dépannage

### Erreur : "Impossible de se connecter au serveur"

**Solution :**
- Vérifiez que le backend est en cours d'exécution (http://localhost:5000)
- Vérifiez la connexion PostgreSQL
- Consultez les logs du terminal backend

### Erreur : "Base de données non trouvée"

**Solution :**
```bash
# Assurez-vous que PostgreSQL est en cours d'exécution
# Vérifiez vos paramètres dans backend/.env
# Réinitialisez la base de données :
cd backend
npm run db:init
```

### Port déjà utilisé

Si le port 5000 ou 5173 est déjà utilisé :
- Backend : Modifiez le PORT dans `backend/.env`
- Frontend : Modifiez le port dans `frontend/vite.config.js`

## 📦 Structure du Projet

```
Vinci Chantier Moderne/
├── backend/
│   ├── src/
│   │   ├── index.js          # Serveur principal
│   │   ├── db/
│   │   │   ├── connection.js # Pool PostgreSQL
│   │   │   └── init.js       # Initialisation BD
│   │   ├── routes/
│   │   │   ├── items.js      # Routes articles
│   │   │   └── history.js    # Routes historique
│   │   └── controllers/
│   │       ├── itemController.js
│   │       └── historyController.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Composant principal
│   │   ├── pages/
│   │   │   ├── ItemsPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── components/
│   │   │   ├── ItemForm.jsx
│   │   │   └── ItemList.jsx
│   │   ├── style.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔧 Commandes Utiles

### Backend
```bash
npm run dev      # Démarrer en mode développement avec watch
npm start        # Démarrer le serveur
npm run db:init  # Initialiser la base de données
```

### Frontend
```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Créer un build de production
npm run preview  # Prévisualiser le build
```

## 🎓 Apprentissage & Développement

### Pour ajouter une nouvelle fonctionnalité :

1. **Backend** : Créez une nouvelle route dans `backend/src/routes/`
2. **Controller** : Ajoutez la logique dans `backend/src/controllers/`
3. **Frontend** : Créez un nouveau composant dans `frontend/src/components/`
4. **Pages** : Intégrez dans une page existante ou créez une nouvelle

### Pour modifier la base de données :

Éditez le fichier `backend/src/db/init.js` et réexécutez `npm run db:init`

## 📞 Support

Pour toute question ou problème, consultez les logs dans les terminaux backend et frontend.

---

**Bonne utilisation de votre Gestionnaire de Stock ! 🎉**
