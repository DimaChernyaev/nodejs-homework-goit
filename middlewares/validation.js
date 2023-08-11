const HttpError = require("../helpers/HttpError");

const validation = (schema) => {
  const func = (req, res, next) => {
    const empty = req._body;
    const { error } = schema.validate(req.body);

    if (!empty) {
      next(HttpError(400, "missing fields"));
    }

    if (error) {
      const type = error.details[0].message.includes("must be a string");
      const requireField = error.details[0].path[0];

      if (type) {
        next(HttpError(400, `all properties must be a string`));
      }

      next(HttpError(400, `missing required ${requireField}`));
    }
    next();
  };
  return func;
};

module.exports = validation;
