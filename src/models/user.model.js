const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = mongoose.Schema;

const userSchema = new schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema, 'users');
