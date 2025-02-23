import express from "express";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../models/contactSchemas.js";

const router = express.Router();

router.get("/", ctrlWrapper(getContacts));
router.get("/:contactId", isValidId, ctrlWrapper(getContact));
router.post("/", validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete("/:contactId", isValidId, ctrlWrapper(deleteContact));

export default router;
