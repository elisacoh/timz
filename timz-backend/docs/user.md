# 📄 docs/user.md — Documentation technique pour le modèle User

## 🧩 Modèle : `User`

Le modèle `User` est la table principale représentant tous les utilisateurs de la plateforme Timz (admins, professionnels, clients). Il est conçu pour centraliser l'authentification, les rôles, et les données de base, tout en étant extensible via des profils spécifiques liés en One-to-One (`ProfileClient`, `ProfilePro`).

### 🔐 Champs de sécurité
| Champ             | Type        | Description                                   |
|------------------|-------------|-----------------------------------------------|
| `id`             | UUID        | Identifiant unique de l'utilisateur           |
| `email`          | String      | Email unique utilisé pour l'authentification  |
| `hashed_password`| String      | Mot de passe haché (BCrypt ou autre)          |
| `token_version`  | Integer     | Sert à invalider les anciens JWT              |

### 📇 Informations de profil
| Champ            | Type         | Description                                    |
|------------------|--------------|------------------------------------------------|
| `full_name`      | String       | Nom complet de l'utilisateur                  |
| `phone`          | String       | Numéro de téléphone (unique, facultatif)      |
| `profile_image`  | String       | URL de l'avatar (valeur par défaut définie)   |
| `roles`          | ARRAY[String]| Liste de rôles : `client`, `pro`, `admin`     |
| `is_active`      | Boolean      | Statut actif ou non de l'utilisateur          |

### 🕒 Timestamps
| Champ           | Type       | Description                            |
|----------------|------------|----------------------------------------|
| `created_at`   | DateTime   | Date de création du compte utilisateur |
| `updated_at`   | DateTime   | Dernière mise à jour du profil         |

### 🔁 Relations externes
- `profile_client` → vers `ProfileClient`
- `profile_pro` → vers `ProfilePro`

---

## 🧩 Modèle : `ProfileClient`

Représente les données additionnelles d'un utilisateur ayant un rôle de client.

### Champs principaux
| Champ        | Type     | Description                               |
|--------------|----------|-------------------------------------------|
| `id`         | UUID     | Clé primaire                              |
| `user_id`    | UUID     | Clé étrangère liée à `User.id`            |
| `phone`      | String   | Téléphone spécifique au profil client     |
| `address`    | JSONB    | Adresse structurée en objet JSON          |
| `created_at` | DateTime | Date de création                          |
| `updated_at` | DateTime | Dernière mise à jour                      |

### Exemple d'`address` JSON :
```json
{
  "street": "12 rue des Lilas",
  "zip": "75020",
  "city": "Paris",
  "country": "France"
}
```

---

## 🧩 Modèle : `ProfilePro`

Contient les informations professionnelles supplémentaires pour les utilisateurs de type `pro`.

### Champs principaux
| Champ           | Type     | Description                              |
|------------------|----------|------------------------------------------|
| `id`             | UUID     | Clé primaire                             |
| `user_id`        | UUID     | Clé étrangère liée à `User.id`           |
| `business_name`  | String   | Nom de l’entreprise                       |
| `website`        | String   | Site web professionnel                   |
| `address`        | JSONB    | Adresse structurée                       |
| `created_at`     | DateTime | Date de création                         |
| `updated_at`     | DateTime | Dernière mise à jour                     |

---