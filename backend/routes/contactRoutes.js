import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// CREATE CONTACT
router.post("/", async (req, res) => {
    try {
        const contact = new Contact(req.body);

        await contact.save();

        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// GET CONTACTS
router.get("/", async (req, res) => {
    try {
        const { status, search } = req.query;

        let filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            const regex = new RegExp(search, "i");

            filter.$or = [
                { name: regex },
                { company: regex }
            ];
        }

        const contacts = await Contact
            .find(filter)
            .sort({ createdAt: -1 });

        res.json(contacts);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// UPDATE CONTACT
router.put("/:id", async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                error: "Contact not found"
            });
        }

        res.json(contact);

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// DELETE CONTACT
router.delete("/:id", async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(
            req.params.id
        );

        if (!contact) {
            return res.status(404).json({
                error: "Contact not found"
            });
        }

        res.json({
            message: "Contact deleted successfully"
        });

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

export default router;