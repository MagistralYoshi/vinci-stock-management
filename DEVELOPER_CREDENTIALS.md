# 🛠️ Developer Panel - Identifiants de Connexion

## Accès au Developer Panel

Le Developer Panel est maintenant accessible dans votre application **Gestionnaire de Stock**.

### 📋 Identifiants de Connexion

| Paramètre | Valeur |
|-----------|--------|
| **Username** | `developer` |
| **Password** | `DevPanel@2026#Secure` |
| **Rôle** | `developer` |
| **Accès** | Disponible aussi pour admin |

---

## 🚀 Comment Accéder au Panel

1. **Déconnectez-vous** avec le bouton 🚪 (rouge)
2. **Connectez-vous** avec:
   - Username: `developer`
   - Password: `DevPanel@2026#Secure`
3. **Cliquez sur le bouton** 🛠️ `Developer` dans la navigation
4. Vous serez redirigé vers le **Developer Panel**

---

## 📊 Fonctionnalités du Developer Panel

### 1️⃣ **Health Status** (Tab par défaut)
- ✅ Vérification du backend API (localhost:5000)
- ✅ Vérification de PostgreSQL  
- ✅ Vérification du Frontend
- ✅ Statut du Service Worker
- 🔄 Bouton pour vérifier manuellement

### 2️⃣ **Logs**
- Enregistrement automatique des vérifications système
- Historique en temps réel
- Sauvegarde dans localStorage

### 3️⃣ **Errors**
- Capture des erreurs système
- Erreurs API
- Erreurs de connexion
- Sauvegardées pour analyse

### 4️⃣ **Updates**
- Historique complet des mises à jour
- Date et auteur de chaque changement
- Status de chaque déploiement

### 🔘 Actions Disponibles

| Action | Description |
|--------|-------------|
| 🔄 **Vérifier maintenant** | Force une vérification immédiate de la santé du système |
| 📥 **Exporter les logs** | Télécharge tous les logs en JSON |
| 🗑️ **Effacer tout** | Nettoie tous les logs et erreurs |

---

## 🔐 Sécurité

⚠️ **Important**: 
- Ces identifiants sont **personnels** et spécifiques à votre compte développeur
- Ne les partagez **PAS** avec d'autres personnes
- Le panel ne montre que les **informations techniques**, pas les données sensibles
- Les identifiants sont stockés localement dans `localStorage`

---

## 📝 Autres Identifiants

### Admin (Gestion Complète)
| Paramètre | Valeur |
|-----------|--------|
| **Username** | `admin` |
| **Password** | `admin` |
| **Rôle** | `admin` |
| **Accès** | Gestion complète + Developer Panel |

---

## 🆘 Dépannage

### Le bouton Developer n'apparaît pas?
1. Vérifiez que vous êtes connecté avec `developer` ou `admin`
2. Rafraîchissez la page (F5 ou Ctrl+R)
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

### Le Health Check échoue?
1. Vérifiez que le backend tourne: `npm run dev` dans le dossier `/backend`
2. Vérifiez que PostgreSQL est lancé
3. Vérifiez la connexion à http://localhost:5000

### Les logs ne s'affichent pas?
1. Ouvrez les DevTools du navigateur (F12)
2. Allez dans l'onglet "Storage" → "Local Storage"
3. Cherchez `dev_logs` et `dev_errors`

---

## 📧 Support

Pour toute question sur le Developer Panel:
- Contactez: Contact.yoshipro@gmail.com
- Vérifiez la console navigateur (F12) pour les erreurs

---

**Dernière mise à jour**: 2026-09-07  
**Version**: 1.0.0
