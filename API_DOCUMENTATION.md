# API Stock Management - Documentation

## 🌐 Base URL

```
http://localhost:5000/api
```

## 📊 Endpoints Disponibles

### Health Check

**GET** `/health`

Vérifie que le serveur et la base de données sont en ligne.

```bash
curl http://localhost:5000/api/health
```

Réponse :
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

### Articles (Items)

#### Récupérer tous les articles

**GET** `/items`

Paramètres optionnels :
- `search` : Recherche par nom ou description
- `category` : Filtrer par catégorie

```bash
curl "http://localhost:5000/api/items?search=perceuse&category=outils"
```

Réponse :
```json
[
  {
    "id": 1,
    "name": "Perceuse",
    "description": "Perceuse électrique",
    "quantity": 5,
    "category": "outils",
    "location": "Hangar A",
    "created_at": "2024-01-20T10:00:00.000Z",
    "updated_at": "2024-01-20T10:00:00.000Z"
  }
]
```

#### Récupérer un article spécifique

**GET** `/items/:id`

```bash
curl http://localhost:5000/api/items/1
```

#### Créer un article

**POST** `/items`

Corps (JSON) :
```json
{
  "name": "Perceuse",
  "description": "Perceuse électrique",
  "quantity": 5,
  "category": "outils",
  "location": "Hangar A"
}
```

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Perceuse", "quantity": 5, "category": "outils"}'
```

Réponse : L'article créé avec son ID

#### Mettre à jour un article

**PUT** `/items/:id`

Corps (JSON) :
```json
{
  "name": "Perceuse",
  "description": "Perceuse électrique 20V",
  "quantity": 5,
  "category": "outils",
  "location": "Hangar A"
}
```

#### Supprimer un article

**DELETE** `/items/:id`

```bash
curl -X DELETE http://localhost:5000/api/items/1
```

---

### Historique

#### Récupérer l'historique

**GET** `/history`

Paramètres optionnels :
- `itemId` : Filtrer par article
- `userId` : Filtrer par utilisateur
- `startDate` : Date de début
- `endDate` : Date de fin

```bash
curl "http://localhost:5000/api/history?startDate=2024-01-20&endDate=2024-01-21"
```

Réponse :
```json
[
  {
    "id": 1,
    "item_id": 1,
    "user_id": 1,
    "action": "exit",
    "quantity": 2,
    "notes": "Projet A",
    "timestamp": "2024-01-20T10:30:00.000Z",
    "item_name": "Perceuse",
    "username": "jean.dupont"
  }
]
```

#### Récupérer l'historique d'un article

**GET** `/history/item/:itemId`

```bash
curl http://localhost:5000/api/history/item/1
```

#### Enregistrer une action (entrée/sortie)

**POST** `/history/action`

Corps (JSON) :
```json
{
  "itemId": 1,
  "userId": 1,
  "action": "entry|exit",
  "quantity": 2,
  "notes": "Projet A"
}
```

```bash
curl -X POST http://localhost:5000/api/history/action \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "userId": 1,
    "action": "exit",
    "quantity": 2,
    "notes": "Projet A"
  }'
```

---

## 🗄️ Modèle de Données

### Table: items

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL PRIMARY KEY | Identifiant unique |
| name | VARCHAR(255) | Nom de l'article |
| description | TEXT | Description détaillée |
| quantity | INTEGER | Quantité en stock |
| category | VARCHAR(100) | Catégorie |
| location | VARCHAR(255) | Localisation |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de modification |

### Table: history

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL PRIMARY KEY | Identifiant unique |
| item_id | INTEGER FK | Référence à l'article |
| user_id | INTEGER FK | Référence à l'utilisateur |
| action | VARCHAR(50) | "entry" ou "exit" |
| quantity | INTEGER | Quantité de l'action |
| notes | TEXT | Notes additionnelles |
| timestamp | TIMESTAMP | Date/heure de l'action |

### Table: users

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL PRIMARY KEY | Identifiant unique |
| username | VARCHAR(100) | Nom d'utilisateur |
| email | VARCHAR(100) | Email |
| password | VARCHAR(255) | Mot de passe hashé |
| created_at | TIMESTAMP | Date de création |

---

## 🔄 Exemples Complets

### Créer un article et enregistrer une sortie

```bash
# 1. Créer un article
ITEM=$(curl -s -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Perceuse Bosch",
    "quantity": 10,
    "category": "outils"
  }')

ITEM_ID=$(echo $ITEM | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

# 2. Enregistrer une sortie
curl -X POST http://localhost:5000/api/history/action \
  -H "Content-Type: application/json" \
  -d "{
    \"itemId\": $ITEM_ID,
    \"userId\": 1,
    \"action\": \"exit\",
    \"quantity\": 3,
    \"notes\": \"Chantier Paris\"
  }"
```

---

## ✅ Codes de Statut HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès - Requête réussie |
| 201 | Créé - Ressource créée avec succès |
| 400 | Erreur - Requête invalide |
| 404 | Non trouvé - Ressource non existante |
| 500 | Erreur serveur |

---

## 🚀 À Venir

- [ ] Authentification JWT
- [ ] Gestion des utilisateurs
- [ ] Statistiques et rapports
- [ ] Export en PDF/Excel
- [ ] Notifications en temps réel
