# Imagiro — Site vitrine

Site vitrine du projet Imagiro. Stack : **React**, **MongoDB**, **Docker**.

**Documentation** : [docs/](docs/README.md) (architecture, API, développement, conventions). Génération de la doc du code : `npm run doc`.

## Créer le dépôt GitHub

Si le dépôt n’existe pas encore sur GitHub :

**Avec GitHub CLI :**
```bash
gh repo create imagiro --private --source=. --remote=origin --push
```

**À la main :**
1. Crée un dépôt sur [github.com/new](https://github.com/new) (ex. `imagiro`).
2. Puis :
```bash
git remote add origin https://github.com/TON_USERNAME/imagiro.git
git push -u origin main
```

## Structure (Vertical Slice Architecture)

- `frontend/src/` — **shared/** (layout), **slices/** (features, ex. home), `App.jsx`
- `backend/src/` — **shared/** (db, app), **slices/** (health, api, …), `index.js`
- `docker-compose.yml` — Orchestration des services

Voir [docs/architecture.md](docs/architecture.md) pour le détail.

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

## Tests unitaires

```bash
# Tous les tests (backend + frontend)
npm test

# Backend uniquement
npm run test:backend

# Frontend uniquement
npm run test:frontend
```

Backend : Vitest + supertest (routes health, api, shared app/db).  
Frontend : Vitest + React Testing Library (App, Layout, Header, Footer, HomePage).

## Hooks Git (Husky)

À chaque commit :

- **pre-commit** : exécute `npm test` (backend + frontend). Le commit est refusé si les tests échouent.
- **commit-msg** : vérifie le format du message avec [Commitlint](https://commitlint.js.org/) (Conventional Commits).

Format attendu : `type(scope): description` (ex. `feat(auth): ajout SSO Google`, `fix: correction lien header`).  
Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

Après un `git clone` ou `npm install`, les hooks sont installés automatiquement (`prepare` → `husky`).

## Licence

Propriétaire — Imagiro.
