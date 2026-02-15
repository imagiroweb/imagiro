# API Backend

Base URL : en production `https://votre-domaine/api`, en dev local `http://localhost:3001` (ou via le proxy Vite `http://localhost:5173/api`).

## Format des réponses

- **Succès** : `200` avec body JSON.
- **Erreur** : code HTTP approprié, body JSON quand c’est possible.

## Endpoints

### `GET /api`

Description courte de l’API.

**Réponse (200)**

```json
{
  "message": "API Imagiro",
  "version": "0.0.1",
  "endpoints": ["/api/health"]
}
```

---

### `GET /api/health`

Contrôle de santé du service (pour monitoring ou load balancer).

**Réponse (200)**

```json
{
  "status": "ok",
  "service": "imagiro-backend"
}
```

---

## Connexion MongoDB

Le backend se connecte à MongoDB au démarrage. La base utilisée est `imagiro`. L’URI est configurable via la variable d’environnement `MONGODB_URI` (par défaut en Docker : `mongodb://mongo:27017`).

Des routes supplémentaires (ex. formulaire de contact, newsletter) pourront s’appuyer sur des collections dans cette base.
