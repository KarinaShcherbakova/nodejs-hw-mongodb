import Contact from "../models/contact.js";
import createError from "http-errors";

export const getAllContacts = async (userId, query) => {
  const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite } = query;
  const filter = { userId };
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

  return { data: contacts, page, perPage, totalItems, totalPages, hasPreviousPage, hasNextPage };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createError(404, "Contact not found");
  return contact;
};

export const createNewContact = async (data) => {
  const { photo, ...contactData } = data;

  let photoUrl = null;
  if (photo) {
    photoUrl = photo.path;
  }

  const contactToCreate = { ...contactData, photo: photoUrl };

  return await Contact.create(contactToCreate);
};

export const updateExistingContact = async (contactId, userId, data, file) => {
  let photoUrl = data.photo || null;

  if (Object.keys(data).length === 0 && !file) {
    throw createError(400, "No fields to update");
  }

  if (file) {
    photoUrl = file.path;
  }

  const updatedContactData = { ...data, photo: photoUrl };

  console.log("Updated Contact Data:", updatedContactData);

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: updatedContactData },
    { new: true, runValidators: true }
  );

  if (!updatedContact) {
    throw createError(404, "Contact not found or does not belong to you");
  }

  return updatedContact;
};

export const removeContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!deletedContact) throw createError(404, "Contact not found or does not belong to you");
  return deletedContact;
};
