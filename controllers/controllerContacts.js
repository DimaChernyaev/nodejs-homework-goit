const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contactsApi");
const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/controllerWrapper");

const getAllContacts = async (req, res, next) => {
  const result = await listContacts();
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const getCurrentContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const addNewContact = async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const deleteCurrentContact = async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await removeContact(contactId);
  if (!deleteContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateCurrentContact = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getCurrentContact: controllerWrapper(getCurrentContact),
  addNewContact: controllerWrapper(addNewContact),
  deleteCurrentContact: controllerWrapper(deleteCurrentContact),
  updateCurrentContact: controllerWrapper(updateCurrentContact),
};
