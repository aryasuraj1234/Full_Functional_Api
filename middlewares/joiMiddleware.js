// joiMiddleware.js

const { signUpSchema } = require('../models/validationSchemas');

function validateSignUp(req, res, next) {
  const validationResult = signUpSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.details[0].message });
  }
  next();
}

module.exports = {
  validateSignUp,
};
