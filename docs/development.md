# Guide de développement

## Prérequis

- **Node.js** 18 ou plus
- **npm** (ou pnpm / yarn)
- **MongoDB** (local ou via Docker)
- **Docker** et **Docker Compose** (optionnel, pour tout lancer en conteneurs)

## Premier démarrage

### Avec Docker (recommandé pour un run complet)

À la racine :

```bash
docker compose up --build
```

- Site : http://localhost  
- API : http://localhost/api  

### En local (frontend + backend séparés)

1. **MongoDB** : installé en local ou :

   ```bash
   docker run -d -p 27017:27017 --name mongo mongo:7
   ```

2. **Backend** :

   ```bash
   cd backend
   cp ../.env.example .env   # optionnel
   npm install
   npm run dev
   ```

   → http://localhost:3001

3. **Frontend** (autre terminal) :

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   → http://localhost:5173 (le proxy envoie `/api` vers le backend)

## Commandes utiles

| Où | Commande | Description |
|----|----------|-------------|
| Racine | `npm run doc` | Génère la doc JSDoc (backend + frontend) |
| Racine | `npm run doc:backend` | Doc JSDoc du backend uniquement |
| Racine | `npm run doc:frontend` | Doc JSDoc du frontend uniquement |
| Frontend | `npm run dev` | Serveur de dev Vite |
| Frontend | `npm run build` | Build de production |
| Backend | `npm run dev` | Backend avec rechargement (--watch) |
| Backend | `npm start` | Backend sans watch |

## Variables d’environnement

- **Backend** : voir `.env.example`. Principales :
  - `PORT` : port du serveur (défaut 3001)
  - `MONGODB_URI` : URI de connexion MongoDB

## Documentation du code

- Rédiger les blocs **JSDoc** pour les fonctions et modules publics (voir [Conventions de code](code-style.md)).
- Après modification du code documenté, regénérer la doc : `npm run doc`, puis consulter `docs/generated/*/index.html`.
