const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        uid: { type: String, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        fullName: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true }
    },
    { timestamps: true }
)

const Users = mongoose.model("users", userSchema);

module.exports = { Users };
