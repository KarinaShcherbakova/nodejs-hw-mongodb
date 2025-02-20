import { isValidObjectId } from "mongoose";

const isValidId = (req, res, next) => {
  if (!isValidObjectId(req.params.contactId)) {
    return res.status(400).json({ status: 400, message: "Invalid ID format" });
  }
  next();
};

export default isValidId;
