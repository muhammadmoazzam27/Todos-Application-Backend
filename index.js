require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");

const cors = require("cors");
const auth = require("./src/routes/auth");
const todo = require("./src/routes/todo");

const app = express();

const PORT = process.env.PORT
const Auth_API = process.env.Auth_Api;
const TODO_API = process.env.Todo_Api

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use(`${Auth_API}`, auth);

app.use(`${TODO_API}`, todo);

app.use("/", (req, res) => {
    res.send("Todos Application");
})

app.use("/health", (req, res) => {
    res.send("Server heath is Good");
})

app.listen(PORT, (req, res) => {
    console.log(`A server is running on PORT ${PORT}`);
})