require("dotenv").config();

const mongoose = require("mongoose");

const MONGODB_URL = process.env.MongoDB_Url

const connectDB = () => {

    mongoose.connect(`${MONGODB_URL}`)

        .then(() => {
            console.log("MongoDB successfully connected")
        })
        .catch(() => {
            console.log("MongoDB not connected")
        })

}

module.exports = { connectDB };