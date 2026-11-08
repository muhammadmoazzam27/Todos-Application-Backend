require("dotenv").config();
const express = require("express");
const cors = require('cors');
const { connectDB } = require("./src/config/db");

const auth = require("./src/routes/auth");
const todo = require("./src/routes/todo");

const app = express();

app.use(cors({
    origin: [
        "https://todos-application-frontend-k4wklxxh6-moazzam-27.vercel.app",
        "http://localhost:5173",
        "http://localhost:4173"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/user/auth", auth);
app.use("/api/user/todo", todo);

app.use("/", (req, res) => {
    res.send("Todos Application");
});

app.use("/health", (req, res) => {
    res.send("Server health is Good");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`A server is running on PORT ${PORT}`);
});