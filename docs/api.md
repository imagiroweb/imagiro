# API Backend

Base URL : en production `https://votre-domaine/api`, en dev local `http://localhost:3001` (ou via le proxy Vite `http://localhost:5173/api`).

## Format des réponses

- **Succès** : `200` ou `201` avec body JSON.
- **Erreur** : code HTTP approprié, body JSON avec champ `error` (ex. `{ "error": "Message" }`).

## Endpoints

### `GET /api`

Description courte de l’API.

**Réponse (200)**

```json
{
  "message": "API Imagiro",
  "version": "0.0.1",
  "endpoints": ["/api/health", "/api/auth/signup", "/api/auth/login", "/api/auth/me"]
}
```

---

### `GET /api/health`

Contrôle de santé du service (monitoring / load balancer).

**Réponse (200)**

```json
{
  "status": "ok",
  "service": "imagiro-backend"
}
```

---

## Authentification

Les routes d’auth renvoient un **JWT** dans le champ `token`. Le client doit l’envoyer en header pour les routes protégées :

```
Authorization: Bearer <token>
```

### `POST /api/auth/signup`

Inscription d’un nouvel utilisateur.

**Body (JSON)**

| Champ    | Type   | Obligatoire | Description              |
|----------|--------|-------------|--------------------------|
| email    | string | oui         | Email (unique)           |
| password | string | oui         | Au moins 8 caractères    |
| name     | string | non         | Nom affiché              |

**Réponse (201)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Jean Dupont"
  }
}
```

**Erreurs** : `400` (champs manquants / mot de passe trop court), `409` (email déjà utilisé).

---

### `POST /api/auth/login`

Connexion (email + mot de passe).

**Body (JSON)**

| Champ    | Type   | Obligatoire |
|----------|--------|-------------|
| email    | string | oui         |
| password | string | oui         |

**Réponse (200)** — ou, si la 2FA est activée pour ce compte :

```json
{
  "requiresTwoFactor": true,
  "tempToken": "eyJ..."
}
```

Le client doit alors appeler `POST /api/auth/2fa/verify` avec `tempToken` et le code TOTP.

**Réponse (200)** — connexion sans 2FA :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Jean Dupont"
  }
}
```

**Erreurs** : `400` (champs manquants), `401` (email ou mot de passe incorrect).

---

### `GET /api/auth/google` (SSO)

Redirection vers la page de consentement Google. Paramètre optionnel : `returnUrl` (URL de retour après connexion, encodée dans le `state` OAuth).

Après autorisation, Google redirige vers `/api/auth/google/callback`. Le backend crée ou récupère l’utilisateur (par email), puis redirige vers le frontend avec `?token=...` ou `?requiresTwoFactor=1&tempToken=...` si la 2FA est activée.

**Configuration** : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, `FRONTEND_URL`.

---

### `GET /api/auth/me`

Utilisateur courant (token requis).

**Headers** : `Authorization: Bearer <token>`

**Réponse (200)**

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Jean Dupont",
    "twoFactorEnabled": false
  }
}
```

**Erreurs** : `401` (token manquant, invalide ou expiré).

---

### Double authentification (2FA)

#### `GET /api/auth/2fa/setup` (token requis)

Génère un secret TOTP et renvoie une URL QR (data URL). Le client affiche le QR pour que l’utilisateur le scanne avec une app (Google Authenticator, etc.), puis envoie le secret + le code dans `POST /api/auth/2fa/enable`.

**Réponse (200)** : `{ "secret": "...", "qrCodeDataUrl": "data:image/png;base64,..." }`

#### `POST /api/auth/2fa/enable` (token requis)

Active la 2FA après vérification du code. **Body** : `{ "code": "123456", "secret": "..." }` (secret renvoyé par `GET /api/auth/2fa/setup`).

#### `POST /api/auth/2fa/verify`

Étape finale après un login (email/mot de passe ou SSO) lorsque le compte a la 2FA activée. **Body** : `{ "tempToken": "...", "code": "123456" }`. Renvoie `token` + `user` (JWT complet).

#### `POST /api/auth/2fa/disable` (token requis)

Désactive la 2FA. **Body** : `{ "code": "123456" }` (code TOTP actuel pour confirmer).

---

## Base de données (MongoDB)

- **Base** : `imagiro`
- **Collection `users`** (authentification) :
  - `email` (string, unique, index)
  - `passwordHash` (string ou null pour compte SSO uniquement)
  - `name` (string ou null)
  - `createdAt` (Date)
  - `googleId` (string, optionnel, pour SSO Google)
  - `twoFactorEnabled` (bool)
  - `twoFactorSecret` (string chiffré, optionnel)

L’URI est configurable via `MONGODB_URI`. Le secret JWT via `JWT_SECRET`. SSO Google : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, `FRONTEND_URL`.
