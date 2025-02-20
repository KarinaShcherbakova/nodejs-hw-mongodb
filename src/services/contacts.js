import Contact from '../models/contact.js';
import createError from 'http-errors';

export const getAllContacts = async () => await Contact.find();

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

export const createNewContact = async (data) => {
  const newContact = new Contact(data);
  await newContact.save();
  return newContact;
};

export const updateExistingContact = async (contactId, data) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, data, { new: true });
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  return updatedContact;
};

export const removeContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};
