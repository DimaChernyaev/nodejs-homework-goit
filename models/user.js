const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { handleErrorMongoose } = require("../helpers");

const emailPattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
const typeUser = ["starter", "pro", "business"];

const ShemaRegisterUser = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(4).required(),
  subscription: Joi.string().valid(...typeUser),
});

const ShemaLoginUser = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().required(),
});

const SchemaSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...typeUser)
    .required(),
});

const SchemaVerifyEmail = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
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
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

UserShema.post("save", handleErrorMongoose);

const User = model("user", UserShema);

const schemas = {
  ShemaRegisterUser,
  ShemaLoginUser,
  SchemaSubscription,
  SchemaVerifyEmail,
};

module.exports = { schemas, User };
