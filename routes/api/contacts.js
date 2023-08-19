const express = require("express");
const controller = require("../../controllers/controllerContacts");
const {
  validation,
  isValidId,
  validationStatus,
} = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", controller.getAllContacts);

router.get("/:contactId", isValidId, controller.getCurrentContact);

router.post("/", validation(schemas.schemaContacts), controller.addNewContact);

router.delete("/:contactId", isValidId, controller.deleteCurrentContact);

router.put(
  "/:contactId",
  isValidId,
  validation(schemas.schemaContacts),
  controller.updateCurrentContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validationStatus(schemas.schemaFavorite),
  controller.updateStatusContact
);

module.exports = router;
