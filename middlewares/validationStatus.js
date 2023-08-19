const { HttpError } = require("../helpers");

const validationStatus = (schema) => {
  const func = (req, res, next) => {
    const empty = req._body;
    const { error } = schema.validate(req.body);

    if (!empty) {
      next(HttpError(400, "missing field favorite"));
    }

    if (error) {
      next(HttpError(400, `field favorite must be a boolean`));
    }

    next();
  };

  return func;
};

module.exports = validationStatus;
