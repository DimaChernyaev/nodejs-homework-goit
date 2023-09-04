const express = require("express");
const { schemas } = require("../../models/user");
const {
  validation,
  authenticate,
  validationSubscription,
  upload,
} = require("../../middlewares");
const controller = require("../../controllers/controllerAuth");

const router = express.Router();

router.post(
  "/register",
  validation(schemas.ShemaRegisterUser),
  controller.register
);

router.post("/login", validation(schemas.ShemaLoginUser), controller.login);

router.get("/current", authenticate, controller.currentUser);

router.post("/logout", authenticate, controller.logout);

router.patch(
  "/",
  authenticate,
  validationSubscription(schemas.SchemaSubscription),
  controller.updateStatus
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controller.updateAvatar
);

module.exports = router;
