/**
 * Connexion MongoDB partagée (Vertical Slice Architecture — shared).
 * @module shared/db
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017'

/** Base de données MongoDB `imagiro`. @type {object|undefined} */
let db

/**
 * Établit la connexion à MongoDB et assigne la base `imagiro` à `db`.
 * @returns {Promise<void>}
 * @throws {Error} Si la connexion échoue
 */
export async function connectMongo() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  db = client.db('imagiro')
  console.log('Connecté à MongoDB')
}

/**
 * Retourne l’instance de la base MongoDB (à appeler après connectMongo).
 * @returns {object} Base MongoDB
 */
export function getDb() {
  return db
}
