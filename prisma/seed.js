const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10)

  // Create a default company
  const company = await prisma.company.create({
    data: {
      name: "Demo Company Inc.",
      address: "123 Tech Street, NY",
    }
  })

  // Create an Admin user for this company
  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@company.com",
      passwordHash,
      role: "COMPANY_ADMIN",
      companyId: company.id
    }
  })

  console.log("Database seeded successfully!")
  console.log("Login Email:", admin.email)
  console.log("Login Password: password123")
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
