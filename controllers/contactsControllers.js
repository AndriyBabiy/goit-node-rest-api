import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";

const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 20, favorite = null } = req.query;

  console.log(req.query);
  const result = await contactsService.listContacts(
    { owner },
    { page, limit, favorite }
  );

  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  let { id: owner } = req.user;

  const result = await contactsService.getContactById({ id, owner });
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsService.removeContact({ id, owner });
  if (!result) {
    throw HttpError(404);
  }

  return res.json(result);
};

const createContact = async (req, res) => {
  const { id: owner } = req.user;

  console.log(typeof owner, owner);

  const result = await contactsService.addContact({ ...req.body, owner });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsService.updateContact(req.body, { id, owner });
  if (!result) {
    throw HttpError(404);
  }

  return res.json(result);
};

const updateStatusContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsService.updateStatusContact(req.body, {
    id,
    owner,
  });
  if (!result) {
    throw HttpError(404);
  }

  return res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
