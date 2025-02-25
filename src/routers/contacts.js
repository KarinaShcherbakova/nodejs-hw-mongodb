import express from "express";
import authenticate from "../middlewares/authenticate.js";
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

router.get("/", authenticate, ctrlWrapper(getContacts));
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(getContact));
router.post("/", authenticate, validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch("/:contactId", authenticate, isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
