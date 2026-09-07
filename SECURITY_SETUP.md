# 🔒 SECURITY SETUP GUIDE - Configuration Sécurisée

## ⚠️ IMPORTANT - À FAIRE AVANT LE DÉPLOIEMENT

Votre application a été **nettoyée de tous les secrets**. 

**VOUS DEVEZ configurer vos propres identifiants avant de déployer!**

---

## 🔑 ÉTAPE 1: Générer des Mots de Passe Sécurisés

### Pour Linux/Mac:
```bash
openssl rand -base64 16
```

### Pour Windows PowerShell:
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Select-Object -First 20
```

**Exemples de bons mots de passe:**
- `sK7mP!xQ9vL2wN4bR&t`
- `F@kL#p9Q2x5mN8zV3yW`
- `H7$jU%9sK2*mP&4vL1xQ`

### Critères Obligatoires:
- ✅ Minimum 12 caractères
- ✅ Majuscules et minuscules mélangées
- ✅ Au moins un chiffre
- ✅ Au moins un caractère spécial (!@#$%^&*)
- ✅ PAS de mots du dictionnaire
- ✅ Unique pour chaque environnement (dev, staging, prod)

---

## 🔐 ÉTAPE 2: Configurer les Identifiants Admin & Developer

### Ouvrir le fichier:
```
frontend/src/App.jsx
```

### Trouver cette section (autour de la ligne 50):
```javascript
const defaultUsers = [
  { id: 1, username: 'admin', password: 'changeme', role: 'admin', createdAt: new Date().toISOString() },
  { id: 2, username: 'developer', password: 'changeme', role: 'developer', createdAt: new Date().toISOString() }
]
```

### Remplacer par vos propres mots de passe:
```javascript
const defaultUsers = [
  { id: 1, username: 'admin', password: 'YOUR_SECURE_ADMIN_PASSWORD_HERE', role: 'admin', createdAt: new Date().toISOString() },
  { id: 2, username: 'developer', password: 'YOUR_SECURE_DEV_PASSWORD_HERE', role: 'developer', createdAt: new Date().toISOString() }
]
```

**Exemple:**
```javascript
const defaultUsers = [
  { id: 1, username: 'admin', password: 'sK7mP!xQ9vL2wN4bR&t', role: 'admin', createdAt: new Date().toISOString() },
  { id: 2, username: 'developer', password: 'F@kL#p9Q2x5mN8zV3yW', role: 'developer', createdAt: new Date().toISOString() }
]
```

---

## 🛠️ ÉTAPE 3: Configurer le Backend JWT_SECRET

### Ouvrir le fichier:
```
backend/.env
```

### Ajouter cette variable:
```
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE
```

**Générez une clé sécurisée:**

Linux/Mac:
```bash
openssl rand -base64 32
```

Windows PowerShell:
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -InputObject (1..999999999) -Count 32) -join ''))
```

**Exemple:**
```
JWT_SECRET=aB7mK!sQ9xL2pN5vR&tW3yF$kU8j%cH6d
```

---

## 🌐 ÉTAPE 4: Variables de Production (Railway)

### Sur Railway Dashboard:

**Backend Service → Variables:**

| Variable | Valeur | Source |
|----------|--------|--------|
| `NODE_ENV` | `production` | Fixe |
| `PORT` | `3000` | Fixe |
| `JWT_SECRET` | Même que backend/.env | ⬆️ ÉTAPE 3 |
| `CORS_ORIGIN` | `https://votre-frontend.vercel.app` | Après déploiement Vercel |
| `DATABASE_URL` | Auto-généré | Railway génère automatiquement |

---

## 🚀 ÉTAPE 5: Variables de Production (Vercel)

### Sur Vercel Dashboard:

**Project Settings → Environment Variables:**

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://votre-url.railway.app/api` |

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

- [ ] Généré 2 mots de passe sécurisés (admin + developer)
- [ ] Généré un JWT_SECRET sécurisé
- [ ] Mis à jour `frontend/src/App.jsx` avec les nouveaux mots de passe
- [ ] Créé `backend/.env` avec JWT_SECRET
- [ ] Testé localement: `npm run dev` (les 2 services)
- [ ] Vérifié que login fonctionne avec les nouveaux identifiants
- [ ] Configuré les variables Railway
- [ ] Configuré les variables Vercel
- [ ] Fait un commit: `git add . && git commit -m "feat: configure security credentials"`
- [ ] ⚠️ NE PAS pousser les vrais mots de passe sur GitHub!

---

## 🚨 CE QU'IL NE FAUT PAS FAIRE

❌ **NE JAMAIS:**
- Pousser `backend/.env` sur GitHub
- Pousser les vraies credentials dans le code
- Utiliser les mêmes mots de passe sur tous les environnements
- Utiliser des mots de passe simples (abc123, password, etc)
- Partager les identifiants par email ou chat non sécurisé
- Stocker les credentials en clair n'importe où

✅ **À LA PLACE:**
- Utilisez `backend/.env.example` comme template
- Utilisez des gestionnaires de secrets (Vault, 1Password, LastPass)
- Changez les mots de passe régulièrement
- Utilisez des .gitignore pour exclure les secrets
- Utilisez les variables de production des hébergeurs

---

## 🔄 POUR LES FUTURES MISES À JOUR

**N'oubliez PAS:**

Avant de faire `git push origin main`:

```bash
# Vérifiez qu'aucun secret n'est exposé
git diff --cached | grep -i "password\|secret\|api_key"

# Si vous voyez quelque chose, retirez-le!
git reset HEAD frontend/src/App.jsx
git checkout -- frontend/src/App.jsx
```

---

## 📞 SUPPORT & QUESTIONS

- **Sécurité des mots de passe:** https://owasp.org/www-community/attacks/
- **Générateur de mots de passe:** https://www.lastpass.com/how-it-works/password-generator
- **JWT Documentation:** https://jwt.io/

---

## 🎯 RÉSUMÉ

1. ✅ Générez vos mots de passe
2. ✅ Configurez `frontend/src/App.jsx`
3. ✅ Configurez `backend/.env`
4. ✅ Testez localement
5. ✅ Configurez Railway et Vercel
6. ✅ Déployez!

**Votre app est maintenant sécurisée!** 🔒

---

*Créé le 2026-09-07*  
*Mis à jour pour la sécurité*
