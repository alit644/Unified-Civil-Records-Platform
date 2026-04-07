import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'

// Debug env
console.log("DB_URL is:", process.env.DATABASE_URL ? "SET (length: " + process.env.DATABASE_URL.length + ")" : "UNDEFINED")

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
