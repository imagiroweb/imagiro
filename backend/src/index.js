/**
 * Backend Imagiro — point d’entrée (Vertical Slice Architecture).
 * @module backend
 */

import 'dotenv/config'
import { connectMongo } from './shared/db.js'
import { getApp, useRouter } from './shared/app.js'
import healthRoutes from './slices/health/health.routes.js'
import apiRoutes from './slices/api/api.routes.js'
import authRoutes from './slices/auth/auth.routes.js'

const PORT = process.env.PORT || 3001

useRouter('/api', healthRoutes)
useRouter('/api', apiRoutes)
useRouter('/api', authRoutes)

const app = getApp()

/**
 * Démarre le serveur après connexion à MongoDB.
 * @returns {Promise<void>}
 */
async function start() {
  try {
    await connectMongo()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend écoute sur http://0.0.0.0:${PORT}`)
    })
  } catch (err) {
    console.error('Démarrage impossible:', err)
    process.exit(1)
  }
}

start()
