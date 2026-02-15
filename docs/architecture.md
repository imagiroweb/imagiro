# Architecture du projet

## Principes : Vertical Slice Architecture (VSA)

Le projet suit une **Vertical Slice Architecture** : l’organisation est faite par **fonctionnalité (slice)** et non par couche technique. Chaque slice regroupe tout ce qui concerne une même capacité (route, handler, UI, styles, etc.), afin de limiter les allers-retours entre dossiers et de faciliter l’évolution par feature.

- **Backend** : une slice = un sous-domaine (ex. health, api). Chaque slice expose ses routes ; l’infra partagée (DB, app Express) est dans `shared/`.
- **Frontend** : une slice = une feature (ex. home). Chaque slice contient composants et styles ; le layout commun (header, footer) est dans `shared/`.

## Vue d’ensemble

1. **Frontend** — React (Vite), servi en prod par nginx
2. **Backend** — API Express + MongoDB
3. **MongoDB** — Base de données

```
┌─────────────┐     /api      ┌─────────────┐     mongodb://    ┌─────────────┐
│   Client    │ ────────────► │   Backend   │ ◄──────────────► │   MongoDB   │
│ (React/Vite)│               │  (Express)  │                   │             │
└─────────────┘               └─────────────┘                   └─────────────┘
       │                             │
       │  (Docker: nginx proxy /api vers backend)
       ▼
  Port 80 (prod) ou 5173 (dev)
```

## Structure des dossiers (VSA)

### Backend

```
backend/src/
├── shared/                 # Infra partagée (cross-cutting)
│   ├── db.js              # Connexion MongoDB, getDb()
│   └── app.js             # Express (cors, json), useRouter(), getApp()
├── slices/                # Une slice = une capacité / sous-domaine
│   ├── health/
│   │   └── health.routes.js   # GET /api/health
│   └── api/
│       └── api.routes.js     # GET /api (description API)
└── index.js               # Bootstrap : connectMongo, enregistrement des slices, listen
```

- **shared** : ce qui sert à toutes les slices (DB, app, config).
- **slices** : chaque dossier = une verticale (routes + logique métier éventuelle). Pour une nouvelle feature (ex. contact), ajouter `slices/contact/` et enregistrer le routeur dans `index.js`.

### Frontend

```
frontend/src/
├── shared/                 # Partagé entre les slices
│   └── layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Layout.jsx      # Header + {children} + Footer
├── slices/                 # Une slice = une feature / page
│   └── home/
│       ├── HomePage.jsx
│       └── HomePage.css
├── App.jsx                 # Compose Layout + slices (ex. HomePage)
├── App.css                 # Styles globaux layout (.app, .header, .main, .footer)
├── main.jsx
└── index.css               # Variables CSS, reset
```

- **shared** : layout, composants réutilisables, utilitaires.
- **slices** : une feature = un dossier (composants + styles). Pour une nouvelle page (ex. contact), ajouter `slices/contact/` et l’intégrer dans `App.jsx` ou le routage.

## Flux

- **Développement** : Vite (frontend) et Node (backend) tournent séparément ; le proxy Vite redirige `/api` vers le backend. MongoDB en local ou en conteneur.
- **Production (Docker)** : Un seul point d’entrée (port 80). Nginx sert le build React et proxyfie `/api` vers le backend ; le backend utilise `shared/db` pour MongoDB.

## Technologies

| Couche | Stack |
|--------|--------|
| Frontend | React 18, Vite 6 |
| Backend | Node.js, Express 4, driver MongoDB |
| Base de données | MongoDB 7 |
| Conteneurisation | Docker, Docker Compose |
