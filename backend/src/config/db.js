const mongoose = require("mongoose");
const { MONGODB_URI } = require("./env");

const connectDB = async () => {
  try {
    let uri = MONGODB_URI;

    // If no MONGODB_URI is set, spin up an in-memory MongoDB instance
    if (!uri) {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log("⚡ Using in-memory MongoDB (no Atlas account needed)");
      console.log("   Data will reset each time the server restarts.");

      // Graceful shutdown — stop the in-memory server when the process exits
      process.on("SIGINT",  async () => { await mongod.stop(); process.exit(0); });
      process.on("SIGTERM", async () => { await mongod.stop(); process.exit(0); });
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Always seed demo data on first startup (skipped if users already exist)
    await seedDemoData();
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// ─── Demo seed ─────────────────────────────────────────────────────────────
async function seedDemoData() {
  const User    = require("../models/User.model");
  const Project = require("../models/Project.model");
  const { Task } = require("../models/Task.model");

  // Skip if already seeded
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log("🌱 Seeding demo data…");

  // Users
  const admin = await User.create({
    name: "Admin User",
    email: "admin@demo.com",
    password: "password123",
    role: "ADMIN",
  });
  const member1 = await User.create({
    name: "Alice Smith",
    email: "alice@demo.com",
    password: "password123",
    role: "MEMBER",
  });
  const member2 = await User.create({
    name: "Bob Johnson",
    email: "bob@demo.com",
    password: "password123",
    role: "MEMBER",
  });

  // Project
  const project = await Project.create({
    title: "Website Redesign",
    description: "Complete overhaul of the company website with new branding.",
    createdBy: admin._id,
    members: [admin._id, member1._id, member2._id],
  });

  const project2 = await Project.create({
    title: "Mobile App Launch",
    description: "Plan and execute the launch of the new mobile application.",
    createdBy: admin._id,
    members: [admin._id, member1._id],
  });

  // Tasks
  const today = new Date();
  const addDays = (d) => { const dt = new Date(today); dt.setDate(dt.getDate() + d); return dt; };

  await Task.create([
    {
      title: "Design homepage mockup",
      description: "Create Figma wireframes for the new homepage layout.",
      project: project._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: addDays(3),
    },
    {
      title: "Write API documentation",
      description: "Document all REST endpoints using Swagger.",
      project: project._id,
      assignedTo: member2._id,
      createdBy: admin._id,
      status: "TODO",
      priority: "MEDIUM",
      dueDate: addDays(7),
    },
    {
      title: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment.",
      project: project._id,
      assignedTo: admin._id,
      createdBy: admin._id,
      status: "DONE",
      priority: "HIGH",
      dueDate: addDays(-2),
    },
    {
      title: "User research interviews",
      description: "Conduct 5 user interviews to gather feedback on current UX.",
      project: project2._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: "TODO",
      priority: "HIGH",
      dueDate: addDays(1),
    },
    {
      title: "Write press release",
      description: "Draft and finalize the press release for the launch event.",
      project: project2._id,
      assignedTo: member2._id,
      createdBy: admin._id,
      status: "TODO",
      priority: "LOW",
      dueDate: addDays(-1),
    },
  ]);

  console.log("✅ Demo data seeded!");
  console.log("─────────────────────────────────────────");
  console.log("  🔐 Demo Login Credentials:");
  console.log("     Admin  → admin@demo.com  / password123");
  console.log("     Member → alice@demo.com  / password123");
  console.log("     Member → bob@demo.com    / password123");
  console.log("─────────────────────────────────────────");
}

module.exports = connectDB;
