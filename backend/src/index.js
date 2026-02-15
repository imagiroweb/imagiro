import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const app = express()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017'

app.use(cors())
app.use(express.json())

let db

async function connectMongo() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  db = client.db('imagiro')
  console.log('Connecté à MongoDB')
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'imagiro-backend' })
})

app.get('/api', (_, res) => {
  res.json({
    message: 'API Imagiro',
    version: '0.0.1',
    endpoints: ['/api/health'],
  })
})

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
