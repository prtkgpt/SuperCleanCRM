import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'user@example.com'
  const password = await bcrypt.hash('password123', 10)

  // Upsert User
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      name: 'Solo Cleaner',
    },
  })

  console.log({ user })

  // Create Client
  const client1 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '555-0101',
      notes: 'Has a dog. Key under mat.',
      addresses: {
        create: {
          street: '123 Maple Ave',
          city: 'Springfield',
          state: 'IL',
          zip: '62704',
        },
      },
    },
  })

  const client2 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '555-0102',
      addresses: {
        create: {
          street: '456 Oak Dr',
          city: 'Springfield',
          state: 'IL',
          zip: '62704',
        },
      },
    },
  })

  console.log({ client1, client2 })

  // Create Jobs
  const today = new Date()
  today.setHours(10, 0, 0, 0)

  const job1 = await prisma.job.create({
    data: {
        userId: user.id,
        clientId: client1.id,
        addressId: (await prisma.address.findFirst({ where: { clientId: client1.id } }))?.id,
        serviceType: 'Standard Clean',
        price: 120,
        startAt: today,
        endAt: new Date(today.getTime() + 2 * 60 * 60 * 1000), // 2 hours
        duration: 120,
        status: 'SCHEDULED',
    }
  })

  // Create a past job
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const job2 = await prisma.job.create({
    data: {
        userId: user.id,
        clientId: client2.id,
        addressId: (await prisma.address.findFirst({ where: { clientId: client2.id } }))?.id,
        serviceType: 'Deep Clean',
        price: 200,
        startAt: yesterday,
        endAt: new Date(yesterday.getTime() + 4 * 60 * 60 * 1000), // 4 hours
        duration: 240,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
    }
  })

  console.log({ job1, job2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
