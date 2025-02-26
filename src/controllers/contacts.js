import * as contactService from "../services/contacts.js";

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
  const newContact = await contactService.createNewContact({ ...req.body, userId: req.user._id });
  res.status(201).json({
    status: 201,
    message: "Contact created successfully!",
    data: newContact,
  });
};

export const updateContact = async (req, res, next) => {
  const updatedContact = await contactService.updateExistingContact(req.params.contactId, req.user._id, req.body);
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
