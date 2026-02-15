# Imagiro — Site vitrine

Site vitrine du projet Imagiro. Stack : **React**, **MongoDB**, **Docker**.

## Structure

- `frontend/` — Application React (Vite)
- `backend/` — API Node.js (Express) + connexion MongoDB
- `docker-compose.yml` — Orchestration des services

## Démarrage avec Docker

```bash
docker compose up --build
```

- **Site** : http://localhost
- **API** : http://localhost/api
- **MongoDB** : port 27017 (connexion directe si besoin)

## Développement local

### Prérequis

- Node.js 18+
- MongoDB (local ou Docker : `docker run -d -p 27017:27017 mongo:7`)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvre http://localhost:5173. Le proxy Vite redirige `/api` vers le backend.

### Backend

```bash
cd backend
cp ../.env.example .env   # optionnel
npm install
npm run dev
```

Le backend écoute sur http://localhost:3001.

## Licence

Propriétaire — Imagiro.
