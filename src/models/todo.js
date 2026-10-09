const mongoose = require("mongoose");

const { Schema } = mongoose;

const todoSchema = new Schema(
    {
        uid: { type: String, required: true, trim: true },
        id: { type: String, required: true, trim: true, unique: true },
        title: { type: String, required: true, trim: true, },
        priority: { type: String, required: true, trim: true, default: "Medium" },
        status: { type: String, required: true, trim: true, default: "Pending" },
        dueDate: { type: String, required: true, trim: true, default: "" },
        description: { type: String, required: true, trim: true },
        imageURL: { type: String, required: true, trim: true },
        imagePublicId: { type: String, required: true, trim: true },
    },
    { timestamps: true }
)

const Todos = mongoose.model("todos", todoSchema);

module.exports = { Todos };