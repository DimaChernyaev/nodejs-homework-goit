const express = require("express");
const controller = require("../../controllers/controllerContacts");
const {
  validation,
  isValidId,
  validationStatus,
  authenticate,
} = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, controller.getAllContacts);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  controller.getCurrentContact
);

router.post(
  "/",
  authenticate,
  validation(schemas.schemaContacts),
  controller.addNewContact
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  controller.deleteCurrentContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validation(schemas.schemaContacts),
  controller.updateCurrentContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validationStatus(schemas.schemaFavorite),
  controller.updateStatusContact
);

module.exports = router;
