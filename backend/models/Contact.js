import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        company: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["Interested", "Follow Up", "Closed"],
            default: "Interested"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Contact", contactSchema);