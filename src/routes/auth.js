const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/auth");
const { randomId } = require("../utils/global");
const { verifyToken } = require("../middleware/authentication");

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET_KEY

router.post("/register", async (req, res) => {

    try {

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required", isError: true })
        }

        const userFound = await Users.findOne({ email })

        if (userFound) {
            return res.status(403).json({ message: "User already exist", isError: true })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const uid = randomId();

        const userData = { uid, fullName, email, password: hashPassword };

        const user = await Users.create(userData);

        await user.save();

        return res.status(201).json({ message: "A user successfully registered", user, isError: false })


    }
    catch (error) {
        console.error("Error : ", error)
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", isError: true })
        }

        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        const userPassword = user.password

        const correctPassword = await bcrypt.compare(password, userPassword)

        if (!correctPassword) {
            return res.status(401).json({ message: "Invalid email or password", isError: true })
        }

        const uid = user.uid

        const token = await jwt.sign({ uid }, `${SECRET_KEY}`, { expiresIn: "2h" })

        return res.status(200).json({ message: "A user successfully login", token, isError: false })

    }
    catch (error) {
        console.error("Error : ", error)
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


router.get("/user", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const user = await Users.findOne({ uid }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        return res.status(200).json({ message: "login successful", user, isError: false })

    }
    catch (error) {
        console.error("Error : ", error)
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


module.exports = router;
