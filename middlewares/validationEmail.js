const { HttpError } = require("../helpers");

const validationEmail = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const type = error.details[0].type === "string.base";

      if (type) {
        next(HttpError(400, "field email must be string"));
      }

      next(HttpError(400, "missing required field email"));
    }

    next();
  };

  return func;
};

module.exports = validationEmail;
