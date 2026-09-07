# 🚀 VERCEL DEPLOYMENT - Frontend

## **Quick Start**

### **1. Connecter Vercel à GitHub**
1. Allez sur https://vercel.com
2. Cliquez `New Project`
3. Sélectionnez `GitHub`
4. Autorisez Vercel à accéder à GitHub
5. Sélectionnez le repo `vinci-stock-management`
6. Vercel détecte automatiquement: **Vite** + **React** ✅

### **2. Configurer les Variables**

**Avant de déployer**, ajoutez cette variable dans Vercel:

**Environment Variable:**
```
VITE_API_URL = https://your-railway-backend-url.railway.app/api
```

> Remplacez `your-railway-backend-url` par l'URL réelle de Railway

**Comment obtenir l'URL Railway:**
1. Allez sur https://railway.app
2. Allez dans votre projet `vinci-stock-management`
3. Cliquez sur le service (backend)
4. Allez dans `Settings` → `Domains`
5. Copiez l'URL (ex: `https://vinci-backend-abc123.railway.app`)

### **3. Déployer!**

1. Dans Vercel, cliquez `Deploy`
2. Attendez ~2-3 minutes
3. Vercel vous donnera une URL comme: `https://vinci-stock-management.vercel.app`

### **4. Tester**

Ouvrez: `https://vinci-stock-management.vercel.app`

Vérifiez:
- ✅ Page charge sans erreurs
- ✅ Login fonctionne (admin / admin)
- ✅ Dashboard affiche les données
- ✅ Developer Panel (🛠️) affiche Backend ✅

---

## 🔗 **URLs Finales**

```
Frontend:  https://your-frontend.vercel.app
Backend:   https://your-backend.railway.app
API:       https://your-backend.railway.app/api
Health:    https://your-backend.railway.app/api/health
```

---

## 🚨 **Si ça échoue**

**Erreur: "Cannot find API"**
- Vérifiez que `VITE_API_URL` est bien configurée dans Vercel
- Déploie le backend d'abord sur Railway

**Erreur: "CORS error"**
- Vérifiez que `CORS_ORIGIN` dans Railway = `https://your-frontend.vercel.app`
- Redéployez le backend après changement

**Erreur: "Build failed"**
- Vérifiez que `npm run build` fonctionne localement
- Vérifiez que tous les fichiers `.env` sont à jour

---

**Besoin d'aide? Contactez:** contact.yoshipro@gmail.com
