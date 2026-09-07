# 🚀 RAILWAY DEPLOYMENT GUIDE

## **Prérequis**
- ✅ Compte GitHub (si pas encore créé: https://github.com/signup)
- ✅ Compte Railway (gratuit: https://railway.app)
- ✅ Code commité localement (FAIT ✓)

---

## 📋 **ÉTAPE 1: Créer un Repo GitHub**

### 1.1 Aller sur GitHub
1. Allez sur https://github.com/new
2. Créez un nouveau repo:
   - **Repository name**: `vinci-stock-management`
   - **Description**: Stock Management App with React + Node.js + PostgreSQL
   - **Visibility**: Public (pour Railway)
   - Cliquez `Create repository`

### 1.2 Ajouter le Remote et Pusher
```bash
cd "c:\Users\nghtm\Desktop\Vinci Chantier Moderne"
git remote add origin https://github.com/YOUR_USERNAME/vinci-stock-management.git
git push -u origin main
```

✅ Votre code est maintenant sur GitHub!

---

## 🚄 **ÉTAPE 2: Configurer Railway**

### 2.1 Connecter Railway à GitHub
1. Allez sur https://railway.app
2. Cliquez `New Project` (c'est ce que vous avez ouvert)
3. Cliquez `GitHub Repository`
4. Cliquez `Authorize with GitHub` (si demandé)
5. Recherchez `vinci-stock-management`
6. Sélectionnez votre repo

### 2.2 Railway Détecte Votre Stack
Railway détecte automatiquement:
- ✅ **Backend**: Node.js + Express
- ✅ **Frontend**: React + Vite
- ⚠️ **Database**: À ajouter manuellement

### 2.3 Ajouter PostgreSQL
1. Dans Railway, en bas à gauche: `+ Add New`
2. Sélectionnez `Database`
3. Choisissez `PostgreSQL`
4. Validez ✅

**Railway va créer automatiquement:**
- 📊 Une base de données PostgreSQL
- 🔐 Un `DATABASE_URL` avec les identifiants
- 🔑 Des variables d'env automatiques

---

## ⚙️ **ÉTAPE 3: Configurer les Variables d'Environnement**

### 3.1 Backend - Variables à Ajouter

Dans Railway, allez dans votre projet et cliquez `Variables`:

| Variable | Valeur | Notes |
|----------|--------|-------|
| `NODE_ENV` | `production` | Environnement |
| `PORT` | `3000` | Port backend |
| `JWT_SECRET` | `votre-secret-key` | Génère une clé sécurisée |
| `CORS_ORIGIN` | `https://your-frontend.railway.app` | À remplir après deploy frontend |
| `DATABASE_URL` | Railway génère automatiquement | ✅ Auto depuis PostgreSQL |

### 3.2 Frontend - Variables à Ajouter

Pour le frontend, créez un fichier `frontend/.env.production`:

```bash
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_ENV=production
```

**Où trouver `your-backend-url`?**
- Dans Railway → Votre backend → `Settings` → Cherchez `URL`
- Exemple: `https://vinci-backend.railway.app`

---

## 🔄 **ÉTAPE 4: Déployer!**

### 4.1 Déploiement Automatique
Railway déploie **automatiquement** quand vous:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### 4.2 Vérifier le Déploiement
1. Dans Railway, cliquez sur votre service
2. Allez dans `Deployments`
3. Observez le status:
   - 🟡 `Deploying...` = En cours
   - ✅ `Success` = Déployé!
   - ❌ `Failed` = Erreur (regardez les logs)

### 4.3 Vérifier la Production
1. Cliquez sur le service
2. Cliquez `Settings`
3. Cherchez l'URL du service:
   - **Backend**: https://your-backend.railway.app
   - **Frontend**: https://your-frontend.railway.app

---

## ✅ **ÉTAPE 5: Tester en Production**

### 5.1 Tester le Backend
Ouvrez: `https://your-backend.railway.app/api/health`

Vous devriez voir:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-07T..."
}
```

### 5.2 Tester le Frontend
Ouvrez: `https://your-frontend.railway.app`

Vous devriez voir votre app!

### 5.3 Tester la Connexion
1. Connectez-vous avec:
   - Username: `admin`
   - Password: `admin`
2. Vérifiez que les données apparaissent
3. Testez le Developer Panel (🛠️)

---

## 🐛 **Dépannage**

### Problème: Service Worker blocage
**Solution**: Le fichier `public/sw.js` a été nettoyé

### Problème: `DATABASE_URL` n'existe pas
**Solution**: Assurez-vous que PostgreSQL est bien ajouté comme service Railway

### Problème: Frontend ne trouve pas l'API
**Solution**: Vérifiez `VITE_API_URL` dans `.env.production`
```bash
# Doit être:
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Problème: Erreur "CORS"
**Solution**: Vérifiez `CORS_ORIGIN` dans les variables backend
```
CORS_ORIGIN=https://your-frontend-url.railway.app
```

### Problème: Logs de déploiement?
Dans Railway:
1. Cliquez sur le service
2. Allez dans `Deployments`
3. Cliquez sur le déploiement
4. Regardez les logs (sections `Build` et `Runtime`)

---

## 📊 **Monitoring & Maintenance**

### URLs Utiles
```
🏠 Frontend: https://your-frontend.railway.app
🔌 Backend API: https://your-backend.railway.app/api
📊 Database: Voir dans Railway → PostgreSQL → Settings
```

### Mettre à Jour le Code
```bash
# Local changes
git add .
git commit -m "My changes"
git push origin main

# Railway déploie automatiquement en ~2 min
```

### Vérifier la Santé du Système
1. Ouvrez le Developer Panel (🛠️)
2. Cliquez `HEALTH`
3. Cliquez `🔄 Vérifier maintenant`
4. Vérifiez que Backend ✅ et PostgreSQL ✅

---

## 💰 **Pricing Railway**

| Tier | Limite | Prix |
|------|--------|------|
| **Free** | 500 hours/mois | $0 |
| **Pro** | Illimité | $5 + usage |
| **Team** | Illimité | $25+ |

Pour une app petite-moyenne: **$5-15/mois** 💚

---

## 🎯 **Checklist Finale**

- [ ] Repo GitHub créé
- [ ] Code pushé sur GitHub
- [ ] Railway repo connecté
- [ ] PostgreSQL ajouté
- [ ] Variables d'environnement configurées
- [ ] Backend déployé ✅
- [ ] Frontend déployé ✅
- [ ] `/api/health` retourne 200 ✅
- [ ] Frontend charge sans erreurs ✅
- [ ] Login fonctionne ✅
- [ ] Developer Panel affiche Backend ✅
- [ ] PostgreSQL ✅

---

## 📞 **Support**

### Erreur de déploiement?
1. Regardez les logs Railway
2. Vérifiez `.env` variables
3. Testez localement d'abord

### Questions sur Railway?
https://docs.railway.app/

### Besoin d'aide?
Contact: contact.yoshipro@gmail.com

---

**Bon déploiement!** 🚀
