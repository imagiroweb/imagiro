/**
 * Application Express partagée (Vertical Slice Architecture — shared).
 * @module shared/app
 */

import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

/**
 * Enregistre un routeur sous un préfixe.
 * @param {string} path - Préfixe (ex. /api)
 * @param {import('express').Router} router - Routeur Express
 */
export function useRouter(path, router) {
  app.use(path, router)
}

/**
 * Retourne l’application Express (pour listen dans index).
 * @returns {import('express').Application}
 */
export function getApp() {
  return app
}
