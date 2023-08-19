const { Contact } = require("../models/contact");
const { HttpError } = require("../helpers");
const { controllerWrapper } = require("../helpers");

const getAllContacts = async (req, res) => {
  const result = await Contact.find();
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const getCurrentContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const addNewContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteCurrentContact = async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await Contact.findByIdAndRemove(contactId);
  if (!deleteContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateCurrentContact = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
  updateStatusContact: controllerWrapper(updateStatusContact),
};
