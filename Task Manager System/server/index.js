require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/project');
const projectUserRoutes = require('./routes/projectUser');
const taskRoutes = require("./routes/task");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/project_user", projectUserRoutes);
app.use("/api/task", taskRoutes);

const port = process.env.PORT || 3001;
app.listen(port, console.log(`Listening on port ${port}...`));
