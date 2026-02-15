# Contribuer au projet Imagiro

Merci de ton intérêt pour contribuer. Voici comment garder le projet cohérent.

## Avant de commencer

1. **Documentation** : lis [docs/](docs/README.md), en particulier :
   - [Architecture](docs/architecture.md)
   - [Guide de développement](docs/development.md)
   - [Conventions de code](docs/code-style.md)

2. **Environnement** : suis le [guide de développement](docs/development.md) pour installer et lancer le projet en local.

## Workflow

1. Créer une branche depuis `main` (ex. `feature/ma-fonctionnalite` ou `fix/correction-bug`).
2. Faire tes modifications en respectant les [conventions de code](docs/code-style.md).
3. Documenter le code avec **JSDoc** pour les fonctions et modules publics (voir [Conventions](docs/code-style.md#documentation-jsdoc)).
4. Tester en local (`npm run dev` dans frontend et backend, ou `docker compose up`).
5. Commiter avec des messages clairs (ex. `feat: ajout du formulaire de contact`, `docs: mise à jour API`).
6. Ouvrir une Pull Request vers `main`.

## Documentation

- Toute modification d’**API** (nouveaux endpoints, changement de format) doit être reflétée dans [docs/api.md](docs/api.md).
- Après modification du code documenté, regénérer la doc JSDoc : `npm run doc` à la racine.

## Questions

En cas de doute sur l’architecture ou les conventions, ouvre une issue ou contacte les mainteneurs.
