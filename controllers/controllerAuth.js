const { User } = require("../models/user");
const { controllerWrapper, HttpError } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const repeatUser = await User.findOne({ email });

  if (repeatUser) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!currentUser.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passworCompare = await bcrypt.compare(password, currentUser.password);

  if (!passworCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: currentUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(currentUser._id, { token });

  res.status(200).json({
    token,
    user: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  });
};

const currentUser = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { subscription });
  res.status(200).json({ subscription });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpDir, originalname } = req.file;

  const uploadFile = await jimp.read(tmpDir);
  await uploadFile.resize(250, 250);
  await uploadFile.writeAsync(tmpDir);

  const fileName = `${_id}_${originalname}`;
  const uploadDir = path.join(avatarsDir, fileName);
  await fs.rename(tmpDir, uploadDir);
  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const currentUser = await User.findOne({ verificationToken });

  if (!currentUser) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(currentUser._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    throw HttpError(404, "Email not found");
  }

  if (currentUser.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${currentUser.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  currentUser: controllerWrapper(currentUser),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
};
