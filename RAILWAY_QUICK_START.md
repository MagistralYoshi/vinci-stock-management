# 🚀 QUICK START - Déployer sur Railway en 5 min

## ⚡ TL;DR (Les 5 étapes rapides)

### 1️⃣ Créer repo GitHub
```bash
# Vous avez déjà commit localement ✓
# Maintenant: Allez sur https://github.com/new
# Créez repo "vinci-stock-management"
# Puis:
git remote add origin https://github.com/YOUR_USERNAME/vinci-stock-management.git
git push -u origin main
```

### 2️⃣ Autoriser Railway
- Allez sur https://railway.app
- Cliquez `New Project`
- Cliquez `GitHub Repository`
- Sélectionnez `vinci-stock-management`
- Railway détecte automatiquement!

### 3️⃣ Ajouter PostgreSQL
- Dans Railway: `+ Add New` → `Database` → `PostgreSQL`
- ✅ Fait!

### 4️⃣ Ajouter Variables (Backend)
Dans Railway, variables d'env:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=generate-a-random-string
CORS_ORIGIN=https://your-frontend.railway.app
DATABASE_URL=auto-generated
```

### 5️⃣ Déployer!
```bash
git push origin main
# Railway déploie automatiquement en 2-3 min
```

---

## 🎯 Après le Déploiement

✅ Ouvrir: `https://your-backend.railway.app/api/health`  
✅ Ouvrir: `https://your-frontend.railway.app`  
✅ Se connecter: admin / admin  
✅ Vérifier Developer Panel 🛠️  

---

**Besoin d'aide détaillée?** → Voir `RAILWAY_SETUP.md`
