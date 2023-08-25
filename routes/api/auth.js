const express = require("express");
const { schemas } = require("../../models/user");
const { validation, authenticate } = require("../../middlewares");
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

module.exports = router;
