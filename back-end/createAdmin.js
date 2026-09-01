const prisma = require("./src/config/prisma");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const password = "Admin@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@school.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();