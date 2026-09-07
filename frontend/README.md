# Frontend - Stock Management Application

Application web React pour gérer le stock de matériel en temps réel.

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📱 Fonctionnalités

### 📋 Page Articles
- ➕ Ajouter de nouveaux articles
- 🔍 Rechercher par nom
- 🏷️ Filtrer par catégorie
- ✏️ Modifier les détails
- 🗑️ Supprimer un article
- 📥 Enregistrer une entrée de stock
- 📤 Enregistrer une sortie de stock

### 📜 Page Historique
- 📅 Visualiser tout l'historique
- 🔍 Filtrer par date
- 👤 Voir qui a effectué chaque action
- 📝 Consulter les notes

## 🏗️ Architecture

```
src/
├── App.jsx               # Composant principal et routing
├── style.css             # Styles globaux
├── main.jsx              # Point d'entrée
├── pages/
│   ├── ItemsPage.jsx     # Page gestion articles
│   └── HistoryPage.jsx   # Page historique
└── components/
    ├── ItemForm.jsx      # Formulaire article
    └── ItemList.jsx      # Liste et actions articles
```

## 🎨 Design

- Interface responsive (mobile, tablet, desktop)
- Dark mode ready (facilement adaptable)
- Icons intégrés avec emojis
- Tailwind-like CSS variables
- Animations fluides

## 🔧 Scripts Disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Créer un build de production
npm run preview  # Prévisualiser le build de production
```

## 🌐 Communication avec l'API

L'application communique avec l'API backend via axios.

Base URL : `http://localhost:5000/api`

Endpoints utilisés :
- `GET /items` - Récupérer tous les articles
- `POST /items` - Créer un article
- `PUT /items/:id` - Mettre à jour un article
- `DELETE /items/:id` - Supprimer un article
- `GET /history` - Récupérer l'historique
- `POST /history/action` - Enregistrer une action

## 📦 Dépendances

- **react** 18 : Bibliothèque UI
- **react-dom** 18 : Rendu React
- **axios** : Client HTTP
- **vite** : Bundler et serveur de développement

## 🚨 Erreurs Courantes

### "Impossible de se connecter au serveur"

Le backend n'est pas en cours d'exécution.

**Solution :** Démarrez le backend avec `npm run dev` dans le dossier `/backend`

### Les données ne se sauvegardent pas

La base de données n'est pas initialisée.

**Solution :** 
```bash
cd ../backend
npm run db:init
```

## 🎓 Développement

### Ajouter un nouveau composant

1. Créez le fichier dans `src/components/`
2. Importez dans la page concernée
3. Utilisez les classes CSS de `style.css`

### Modifier les styles

Tous les styles sont dans `src/style.css` avec variables CSS pour faciliter la modification.

## 📱 Responsive Design

L'application est entièrement responsive avec breakpoints :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🚀 Build Production

```bash
npm run build
```

Crée un dossier `dist/` prêt pour la production.

## 🔄 État Global

Actuellement, l'état est géré au niveau des composants avec `useState`. Pour un projet plus complexe, considérez :
- Context API
- Redux
- Zustand
- Jotai

## 📞 Support

Consultez le [INSTALLATION.md](../INSTALLATION.md) pour plus de détails d'installation.
