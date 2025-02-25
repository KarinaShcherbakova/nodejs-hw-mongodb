import Contact from "../models/contact.js";
import createHttpError from "http-errors";

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.status(200).json({
      status: "success",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id });

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create({ ...req.body, userId: req.user._id });

    res.status(201).json({
      status: "success",
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found or does not belong to you");
    }

    res.status(200).json({
      status: "success",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: req.params.contactId, userId: req.user._id });

    if (!deletedContact) {
      throw createHttpError(404, "Contact not found or does not belong to you");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
