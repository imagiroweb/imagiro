/**
 * Backend Imagiro — API Express + MongoDB.
 * @module backend
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const app = express()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017'

app.use(cors())
app.use(express.json())

/** Base de données MongoDB `imagiro`. @type {object|undefined} */
let db

/**
 * Établit la connexion à MongoDB et assigne la base `imagiro` à `db`.
 * @returns {Promise<void>}
 * @throws {Error} Si la connexion échoue
 */
async function connectMongo() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  db = client.db('imagiro')
  console.log('Connecté à MongoDB')
}

/**
 * Health check du backend (monitoring / load balancer).
 * @param {object} _ - Requête Express (non utilisée)
 * @param {object} res - Réponse Express (JSON)
 */
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'imagiro-backend' })
})

/**
 * Description courte de l’API et liste des endpoints.
 * @param {object} _ - Requête Express (non utilisée)
 * @param {object} res - Réponse Express (JSON)
 */
app.get('/api', (_, res) => {
  res.json({
    message: 'API Imagiro',
    version: '0.0.1',
    endpoints: ['/api/health'],
  })
})

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
