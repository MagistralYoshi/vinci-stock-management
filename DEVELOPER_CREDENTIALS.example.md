51# DEVELOPER CREDENTIALS - EXAMPLE TEMPLATE
# Cette est un template. Générez vos propres identifiants en production!

## 🛠️ Developer Panel - Identifiants de Connexion

Le Developer Panel nécessite des identifiants sécurisés.

### 📋 Format des Identifiants (À configurer)

| Paramètre | Valeur | Notes |
|-----------|--------|-------|
| **Username** | À configurer | Utilisateur développeur |
| **Password** | À générer | Minimum 12 caractères |
| **Rôle** | `developer` | Accès panel uniquement |
| **Accès** | Dashboard + Panel | Disponible aussi pour admin |

---

## 🔐 Comment Configurer les Identifiants

### Lors du Premier Démarrage

1. Ouvrez `frontend/src/App.jsx`
2. Trouvez la section `defaultUsers`
3. Générez des mots de passe sécurisés:
   ```javascript
   const defaultUsers = [
     { 
       id: 1, 
       username: 'admin', 
       password: 'bD!qOuS$V8iPbVHVZv5C', // À remplacer!
       role: 'admin', 
       createdAt: new Date().toISOString() 
     },
     { 
       id: 2, 
       username: 'developer', 
       password: 'lo&FybhYaLQ59hLtGB!F', // À remplacer!
       role: 'developer', 
       createdAt: new Date().toISOString() 
     }
   ]
   ```

### Générer des Mots de Passe Sécurisés

Utilisez un gestionnaire de mots de passe ou:
```bash
# Linux/Mac
openssl rand -base64 16

# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -InputObject (1..99999999) -Count 16) -join '')) | Select-Object -First 20
```

**Critères:**
- ✅ Minimum 12 caractères
- ✅ Mélange de majuscules, minuscules, chiffres, symboles
- ✅ Pas de mots du dictionnaire
- ✅ Unique pour chaque environnement

---

## 🔑 Sécurité

⚠️ **IMPORTANT**:
- **NE JAMAIS** commiter les mots de passe réels sur GitHub
- **NE JAMAIS** partager les identifiants
- Utiliser `localStorage` pour le stockage local uniquement
- En production, implémenter un système JWT complet
- Utiliser HTTPS toujours

---

## 🛡️ Recommandations Futures

Pour la production:
1. ✅ Hacher les mots de passe avec bcrypt
2. ✅ Stocker les users en base de données
3. ✅ Utiliser JWT pour les sessions
4. ✅ Implémenter OAuth2
5. ✅ Deux facteurs d'authentification (2FA)

---

**Génère tes identifiants et garde-les en lieu sûr!** 🔒
