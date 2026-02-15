# Documentation — Imagiro

Documentation du projet site vitrine Imagiro.

## Sommaire

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | Structure du projet, services, flux |
| [API](api.md) | Endpoints du backend, formats des réponses |
| [Développement](development.md) | Environnement local, commandes, debug |
| [Conventions de code](code-style.md) | Style, JSDoc, nommage, bonnes pratiques |

## Documentation générée (JSDoc)

Générer la doc du code (backend + frontend) :

```bash
# À la racine du projet
npm run doc
```

- **Backend** : sortie dans `docs/generated/api-backend/` (ouvrir `index.html`)
- **Frontend** : sortie dans `docs/generated/frontend/` (ouvrir `index.html`)

Commandes ciblées :

```bash
npm run doc:backend   # uniquement l’API backend
npm run doc:frontend  # uniquement le frontend
```
