const express = require("express");

const examRoutes = require("./routes/examRoutes");
const prisma = require("./config/prisma");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("APP.JS IS WORKING");
});

app.get("/test", (req, res) => {
  res.json({
    message: "TEST ROUTE IS WORKING",
  });
});

// Prisma + MySQL test
app.get("/test-prisma", async (req, res) => {
  try {
    const exams = await prisma.exam.findMany();

    res.json({
      success: true,
      message: "Prisma connected to MySQL successfully",
      exams,
    });
  } catch (error) {
    console.error("PRISMA ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Prisma/MySQL connection failed",
      error: error.message,
    });
  }
});

app.use("/api/exams", examRoutes);

module.exports = app;