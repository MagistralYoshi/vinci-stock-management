# 🚀 Démarrage Rapide - 5 Minutes

Suivez ces étapes pour avoir votre application fonctionnelle en 5 minutes.

## ✅ Prérequis Vérifiés

- ✔️ Node.js 16+ installé
- ✔️ PostgreSQL 12+ installé et en cours d'exécution

## 📋 Étapes

### 1️⃣ Configurer la Base de Données (Windows)

Ouvrez PowerShell et exécutez :

```powershell
psql -U postgres
```

Puis tapez dans psql :

```sql
CREATE DATABASE stock_management;
CREATE USER stock_user WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE stock_management TO stock_user;
\q
```

### 2️⃣ Démarrer le Backend

Ouvrez un Terminal et allez dans le dossier du projet :

```bash
cd "c:\Users\nghtm\Desktop\Vinci Chantier Moderne"
cd backend
npm install
cp .env.example .env
```

**Modifier `.env` :**
```
DB_PASSWORD=mypassword
```

Puis :

```bash
npm run db:init
npm run dev
```

✅ Vous devriez voir :
```
✅ Serveur démarré sur http://localhost:5000
```

### 3️⃣ Démarrer le Frontend

Ouvrez un **NOUVEAU Terminal** et allez dans le dossier du projet :

```bash
cd "c:\Users\nghtm\Desktop\Vinci Chantier Moderne"
cd frontend
npm install
npm run dev
```

✅ Vous devriez voir :
```
VITE v5.0.8  ready in ... ms
Local:   http://localhost:5173/
```

### 4️⃣ Ouvrir l'Application

Cliquez sur le lien ou ouvrez votre navigateur :

👉 **http://localhost:5173/**

## 🎉 C'est Prêt !

Vous pouvez maintenant :
- ➕ Ajouter des articles
- 🔍 Rechercher dans votre stock
- 📥 Enregistrer des entrées
- 📤 Enregistrer des sorties
- 📜 Consulter l'historique complet

## 📱 Utilisation

### Ajouter un Article
1. Cliquez sur **+ Ajouter un article**
2. Remplissez le formulaire
3. Cliquez sur **✓ Ajouter l'article**

### Enregistrer une Entrée/Sortie
1. Trouvez l'article dans la liste
2. Cliquez sur **📤 Entrée/Sortie**
3. Sélectionnez "Entrée" ou "Sortie"
4. Entrez la quantité
5. Cliquez sur **✓ Enregistrer**

### Consulter l'Historique
1. Allez à l'onglet **📜 Historique**
2. Filtrez par date si besoin
3. Voyez qui a pris quoi et quand

## 🆘 Problèmes ?

### Erreur de connexion au serveur

```
Erreur : Impossible de se connecter au serveur
```

✅ **Solution :** Le terminal du backend affiche-t-il "Serveur démarré" ?

Si non, vérifiez :
- PostgreSQL est-il en cours d'exécution ?
- Avez-vous bien exécuté `npm install` et `npm run db:init` ?

### Port déjà utilisé

```
Error: listen EADDRINUSE
```

✅ **Solution :** Fermez le terminal et recommencez. Si ça persiste :

```bash
# Backend
cd backend
# Modifiez PORT=5001 dans .env

# Frontend
cd frontend
# Modifiez le port dans vite.config.js
```

## 📚 Besoin de Plus de Détails ?

- [INSTALLATION.md](INSTALLATION.md) - Guide complet d'installation
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentation API complète
- [backend/README.md](backend/README.md) - Documentation backend
- [frontend/README.md](frontend/README.md) - Documentation frontend

## 🎓 Prochaines Étapes

Une fois que tout fonctionne, vous pouvez :

1. **Ajouter des utilisateurs** : Backend prêt pour JWT
2. **Ajouter des rapports** : Exporter en PDF/Excel
3. **Ajouter des notifications** : Alertes en temps réel
4. **Déployer** : Heroku, Vercel, ou votre serveur

---

**Besoin d'aide ?** Consultez les fichiers README ou vérifiez les logs dans les terminaux.

**Bonne gestion de stock ! 📦✨**
