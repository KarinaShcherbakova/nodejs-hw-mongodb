import express from "express";
import swaggerUi from "swagger-ui-express";
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
import upload from '../middlewares/upload.js';

const router = express.Router();


router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  console.log("Headers:", req.headers);
  console.log("Body before Multer:", req.body);
  next();
});

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup());
router.use(authenticate);

router.get("/", ctrlWrapper(getContacts));
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(getContact));
router.post(
  "/",
  authenticate,
  upload.single("photo"),
  ctrlWrapper(createContact)
);
router.patch("/:contactId", authenticate, isValidId, upload.single('photo'),
validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
