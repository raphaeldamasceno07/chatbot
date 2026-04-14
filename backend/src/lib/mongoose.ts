import { env } from '@/env/index.js'
import mongoose from 'mongoose'

export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGO_URL)
    console.log('🍃 MongoDB connected successfully')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.connection.close()
    console.log('🛑 MongoDB disconnected successfully')
  } catch (err) {
    console.error('❌ MongoDB disconnection error:', err)
  }
}
