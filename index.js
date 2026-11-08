require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");

const cors = require("cors");
const auth = require("./src/routes/auth");
const todo = require("./src/routes/todo");

const app = express();

const PORT = process.env.PORT

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/user/auth", auth);

app.use("/api/user/todo", todo);

app.use("/", (req, res) => {
    res.send("Todos Application");
})

app.use("/health", (req, res) => {
    res.send("Server heath is Good");
})

app.listen(PORT, (req, res) => {
    console.log(`A server is running on PORT ${PORT}`);
})