const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../validations/user.validation');
const { signAccessToken } = require('../helper/jwt_helper');

router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const doesUserExist = await User.findOne({ email: result.email });
    if (doesUserExist) {
      throw createError.Conflict(
        `User with email ${result.email} already exists`
      );
    }

    const user = new User(result);
    const userData = await user.save();
    const accessToken = await signAccessToken(userData._id);
    console.log('accessToken', accessToken);
    res.json({ accessToken });
  } catch (error) {
    error.status = error.isJoi ? 422 : error.status || 500;
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.BadRequest('User not found');

    const isValidPassword = await user.isValidPassword(result.password);
    if (!isValidPassword)
      throw createError.Unauthorized('Invalid Email/Password');

    return res.json({ accessToken: await signAccessToken(user._id) });
  } catch (error) {
    if (error.isJoi)
      return next(createError.BadRequest('Invalid UserName/Password.'));
    next(error);
  }
});

router.post('/refresh-token', async (req, res, next) => {});

router.delete('/logout', async (req, res, next) => {});

module.exports = router;
