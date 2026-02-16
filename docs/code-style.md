# Conventions de code et documentation

## Style général

- **Indentation** : 2 espaces.
- **Guillemets** : simples `'` pour les chaînes en JS, sauf si la chaîne contient une apostrophe.
- **Point-virgules** : utilisés en fin d’instruction.
- **Nommage** :
  - **camelCase** pour variables et fonctions.
  - **PascalCase** pour composants React et types/classes.
  - **UPPER_SNAKE** pour constantes (si besoin).

## Documentation JSDoc

Documenter les **modules**, **fonctions** et **paramètres** publics avec des blocs JSDoc.

### Exemple — fonction

```javascript
/**
 * Connecte l’application à MongoDB.
 * @returns {Promise<void>}
 * @throws {Error} Si la connexion échoue
 */
async function connectMongo() {
  // ...
}
```

### Exemple — route Express

```javascript
/**
 * Health check pour le backend.
 * @param {import('express').Request} _ - Requête (non utilisée)
 * @param {import('express').Response} res - Réponse
 */
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'imagiro-backend' })
})
```

### Exemple — composant React

```jsx
/**
 * Composant principal de l’application vitrine.
 * @returns {JSX.Element}
 */
function App() {
  return (/* ... */)
}
```

### Tags utiles

| Tag | Usage |
|-----|--------|
| `@param {Type} name` | Paramètre |
| `@returns {Type}` | Valeur de retour |
| `@throws {Error}` | Erreur éventuelle |
| `@description` ou première phrase | Description |
| `@example` | Exemple d’utilisation |

**Note** : Pour que la génération JSDoc fonctionne sans erreur, utiliser des types simples dans les tags (`object`, `Promise<void>`, etc.) plutôt que des types `import('module').Type`.

## Fichiers et Vertical Slice Architecture

- **Frontend** : une **slice** = un dossier sous `src/slices/<feature>/` (ex. `home/HomePage.jsx` + `HomePage.css`). Un composant principal par fichier (PascalCase).
- **Backend** : une **slice** = un dossier sous `src/slices/<feature>/` (ex. `health/health.routes.js`). Chaque slice exporte un routeur ; l’infra partagée reste dans `shared/`.

## Génération de la doc

Après avoir ajouté ou modifié des JSDoc :

```bash
npm run doc
```

La doc HTML est générée dans `docs/generated/` (backend et frontend). Ces dossiers sont dans `.gitignore` ; la doc est recréée à la demande ou en CI.
