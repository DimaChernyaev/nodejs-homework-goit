const express = require("express");
const controller = require("../../controllers/controllerContacts");
const validation = require("../../middlewares/validation");
const { schemaContacts } = require("../../schemas/schemasContacts");

const router = express.Router();

router.get("/", controller.getAllContacts);

router.get("/:contactId", controller.getCurrentContact);

router.post("/", validation(schemaContacts), controller.addNewContact);

router.delete("/:contactId", controller.deleteCurrentContact);

router.put(
  "/:contactId",
  validation(schemaContacts),
  controller.updateCurrentContact
);

module.exports = router;
