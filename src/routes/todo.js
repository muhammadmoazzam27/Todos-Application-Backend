const express = require("express");
const { verifyToken } = require("../middleware/authentication");
const { randomId } = require("../utils/global");

const { cloudinary } = require("../config/cloudinary");
const { Todos } = require("../models/todo");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create", verifyToken, upload.fields([{ name: "image" }]), async (req, res) => {
    try {

        const uid = req.uid;

        const { title, priority, status, dueDate, description } = req.body;

        if (!title || !dueDate || !description) {
            return res.status(400).json({ message: "All fields are required", isError: true });
        }

        let imageURL = "", imagePublicId = "";

        if (req.files && req.files["image"] && req.files["image"][0]) {
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "todos",
                        resource_type: "auto",
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

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true });
    }
});


router.get("/get/all/todos", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const allTodos = await Todos.find({ uid });

        return res.status(200).json({ message: "Todos fetched successfully", allTodos, isError: false });


    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true });
    }

})

router.patch("/edit/single/todo", verifyToken, async (req, res) => {
    try {
        const uid = req.uid;
        // id ko bhi req.body se destructure karein
        const { id, title, priority, status, dueDate, description } = req.body;

        // Agar dueDate optional rakhni hai toh validation se hata dein, 
        // ya phir frontend se dueDate bheji jaye.
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required", isError: true });
        }

        const todoUpdated = { title, priority, status, dueDate, description };

        // Sahi tarika: Filter ({ id, uid }) aur update data ({ $set: todoUpdated }) dein
        const todo = await Todos.findOneAndUpdate(
            { id, uid },
            { $set: todoUpdated },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found", isError: true });
        }

        return res.status(200).json({ message: "Todo successfully updated", todo, isError: false });

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true });
    }

});


router.delete("/delete/single/todo/:id", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const { id } = req.params;

        const todoFind = await Todos.findOne({ uid, id });

        if (!todoFind) {
            return res.status(404).json({ message: "Todo not found", isError: true });
        }

        const deleteTodo = await Todos.findOneAndDelete({ uid, id });

        return res.status(200).json({ message: "Todo deleted successfully", deleteTodo, isError: false })

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true });
    }

})

module.exports = router;
