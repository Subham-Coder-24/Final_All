const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const discussRoutes = require("./routes/discussRoutes.js");
const enrollmentRoutes = require("./routes/enrollmentRoutes.js");

const employeeRoutes = require("./routes/employeeRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/discuss", discussRoutes);
app.use("/api/enrollment", enrollmentRoutes);

app.use("/api/dashboard/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Event Planner API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
