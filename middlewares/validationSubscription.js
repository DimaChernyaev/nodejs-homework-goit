const { HttpError } = require("../helpers");

const validationSubscription = (schema) => {
  const func = (req, res, next) => {
    const empty = req._body;
    const { error } = schema.validate(req.body);
    console.log(error);

    if (!empty) {
      next(HttpError(400, "missing field subscription"));
    }

    if (error) {
      next(
        HttpError(400, `subscription must be one of [starter, pro, business]`)
      );
    }

    next();
  };

  return func;
};

module.exports = validationSubscription;
