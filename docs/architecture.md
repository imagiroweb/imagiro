# Architecture du projet

## Vue d’ensemble

Le projet est un **site vitrine** découpé en trois parties :

1. **Frontend** — Application React (Vite), servie en production par nginx
2. **Backend** — API Node.js (Express), connectée à MongoDB
3. **MongoDB** — Base de données (persistance optionnelle pour le vitrine)

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

## Structure des dossiers

```
imagiro/
├── frontend/           # Application React
│   ├── src/            # Composants, styles, point d’entrée
│   ├── public/         # Assets statiques
│   ├── Dockerfile      # Build React + nginx
│   └── nginx.conf      # Config nginx (proxy /api)
├── backend/            # API Node.js
│   └── src/
│       └── index.js    # Express, routes, connexion MongoDB
├── docs/               # Documentation (markdown + générée)
│   ├── generated/     # Sortie JSDoc (gitignore)
│   └── *.md           # Architecture, API, dev, style
├── docker-compose.yml # Orchestration des 3 services
└── package.json       # Scripts racine (ex: npm run doc)
```

## Flux

- **Développement** : Vite (frontend) et Node (backend) tournent séparément ; le proxy Vite redirige `/api` vers le backend. MongoDB peut être local ou dans un conteneur.
- **Production (Docker)** : Un seul point d’entrée (port 80). Nginx sert le build React et proxyfie `/api` vers le backend ; le backend parle à MongoDB via le réseau Docker.

## Technologies

| Couche | Stack |
|--------|--------|
| Frontend | React 18, Vite 6 |
| Backend | Node.js, Express 4, driver MongoDB |
| Base de données | MongoDB 7 |
| Conteneurisation | Docker, Docker Compose |
