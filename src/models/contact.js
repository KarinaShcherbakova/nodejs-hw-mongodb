import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      required: true,
    },
    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
      required: [true, "Contact type is required"],
      default: "personal",
    },
    photo: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
