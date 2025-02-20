import Contact from "../models/contact.js";
import createError from "http-errors";

export const getAllContacts = async (query) => {
  const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite } = query;
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip((page - 1) * perPage)
    .limit(Number(perPage));

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) throw createError(404, "Contact not found");
  return contact;
};

export const createNewContact = async (data) => {
  return await Contact.create(data);
};

export const updateExistingContact = async (contactId, data) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, data, { new: true });
  if (!updatedContact) throw createError(404, "Contact not found");
  return updatedContact;
};

export const removeContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  if (!deletedContact) throw createError(404, "Contact not found");
  return deletedContact;
};
