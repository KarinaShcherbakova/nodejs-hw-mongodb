import createError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createNewContact,
  updateExistingContact,
  removeContact,
} from "../services/contacts.js";

export const getContacts = async (req, res, next) => {
  try {
    const result = await getAllContacts(req.query);
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    res.status(200).json({
      status: 200,
      message: "Contact found",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await createNewContact(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await updateExistingContact(req.params.contactId, req.body);
    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    await removeContact(req.params.contactId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
