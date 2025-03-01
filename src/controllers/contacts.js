import * as contactService from "../services/contacts.js";
import { v2 as cloudinary } from "cloudinary";
import { createContactSchema } from "../models/contactSchemas.js"; // Імпортуємо схему для валідації



export const getContacts = async (req, res, next) => {
  const result = await contactService.getAllContacts(req.user._id, req.query);
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: result,
  });
};

export const getContact = async (req, res, next) => {
  const contact = await contactService.getContactById(req.params.contactId, req.user._id);
  res.status(200).json({
    status: 200,
    message: "Successfully found contact!",
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  console.log("File received by Multer:", req.file);

  console.log("Starting upload to Cloudinary...");
  const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    folder: "contacts",
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  });

  const photoUrl = uploadResponse.secure_url;
  console.log("Cloudinary photo URL:", photoUrl);

  req.body.photo = photoUrl;

  console.log("Validating request body:", req.body);
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const newContact = await contactService.createNewContact({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: "Contact created successfully!",
    data: newContact,
  });
};

export const updateContact = async (req, res, next) => {
  const updatedContact = await contactService.updateExistingContact(req.params.contactId, req.user._id, req.body, req.file);
  res.status(200).json({
    status: 200,
    message: "Contact updated successfully!",
    data: updatedContact,
  });
};

export const deleteContact = async (req, res, next) => {
  await contactService.removeContact(req.params.contactId, req.user._id);
  res.status(204).send();
};
