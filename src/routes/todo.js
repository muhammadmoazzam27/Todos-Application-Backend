const express = require("express");
const { verifyToken } = require("../middleware/authentication");
const { randomId } = require("../utils/global");

const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const { Todos } = require("../models/todo");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create", verifyToken, upload.fields([{ name: "image" }]), async (req, res) => {
    try {
        const uid = req.uid;

        console.log("File : ", req.files);
        console.log("Body : ", req.body);

        const { title, priority, status, dueDate, description } = req.body;

        if (!title || !dueDate || !description) {
            return res.status(400).json({ message: "All fields are required", isError: true });
        }

        let imageURL = "", imagePublicId = "";

        if (req.files && req.files["image"] && req.files["image"][0]) {
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "todos",              // Clean folder name
                        resource_type: "auto",        // Images & PDFs dono ke liye
                        type: "upload"
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Error Detail:", error);
                            return reject(error);
                        }
                        imageURL = result.secure_url;
                        imagePublicId = result.public_id;
                        resolve();
                    }
                );
                uploadStream.end(req.files["image"][0].buffer);
            });
        }

        const id = randomId();
        const todoData = { uid, id, title, priority, status, dueDate, description, imageURL, imagePublicId };

        const todo = await Todos.create(todoData);
        await todo.save();

        return res.status(201).json({ message: "A todo successfully created", todo, isError: false });

    } catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: error.message || "Something went wrong", isError: true });
    }
});

module.exports = router;
