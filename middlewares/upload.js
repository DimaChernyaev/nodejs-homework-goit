const multer = require("multer");
const path = require("path");
const tmpDir = path.join(__dirname, "../", "tmp");

const configMulter = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: configMulter,
});

module.exports = upload;
