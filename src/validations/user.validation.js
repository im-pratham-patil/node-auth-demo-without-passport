const Joi = require('@hapi/joi');

const authSchema = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(4).max(30).required(),
});

module.exports = { authSchema };
