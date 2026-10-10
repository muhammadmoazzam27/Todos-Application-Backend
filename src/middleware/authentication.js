const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {

    try {

        const SECRET_KEY = process.env.JWT_SECRET_KEY

        const authHeader = req?.headers?.authorization

        if (!authHeader) {
            return res.status(400).json({ message: "Unauthorized token", isError: true })
        }

        const token = await authHeader.split(" ")[1]

        const decoded = await jwt.verify(token, `${SECRET_KEY}`)

        if (!decoded) {
            return res.status(401).json({ message: "Invalid Token", isError: true })
        }

        req.uid = decoded.uid;

        next();

    }
    catch (error) {
        console.error("Error : ", error)
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

}

module.exports = { verifyToken };