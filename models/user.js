const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { handleErrorMongoose } = require("../helpers");

const emailPattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
const typeUser = ["starter", "pro", "business"];

const ShemaRegisterUser = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(4).required(),
  subscription: Joi.string()
    .valid(...typeUser)
    .required(),
});

const ShemaLoginUser = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(4).required(),
});

const UserShema = new Schema(
  {
    email: {
      type: String,
      match: emailPattern,
      unique: true,
      required: [true, "Set email for user"],
    },
    password: {
      type: String,
      minlength: 4,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: typeUser,
      default: "starter",
    },
  },
  { versionKey: false, timestamps: true }
);

UserShema.post("save", handleErrorMongoose);

const User = model("user", UserShema);

const schemas = {
  ShemaRegisterUser,
  ShemaLoginUser,
};

module.exports = { schemas, User };
