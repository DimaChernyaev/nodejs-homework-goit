const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const { DB_HOST, PORT } = process.env;

(async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server running");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();
