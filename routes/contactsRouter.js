import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:id", contactsController.getOneContact);

contactsRouter.delete("/:id", contactsController.deleteContact);

// contactsRouter.post(
//   "/",
//   validateBody(createContactSchema),
//   contactsController.createContact
// );

contactsRouter.post("/", contactsController.createContact);

contactsRouter.put("/:id", contactsController.updateContact);

export default contactsRouter;
