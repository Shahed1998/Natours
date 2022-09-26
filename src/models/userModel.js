/* eslint-disable no-return-await */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
// eslint-disable prefer-arrow-callback

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      // This only works on save & save
      validator: function (el) {
        return el === this.password; // returns true / false
      },
      message: 'Passwords are not same', // error message
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // run this function only if password is modified
  if (!this.isModified('password')) return next();
  // bcrypt hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

// instance method
// verify password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// changed if password changed after token issued
// if password changed date > token issued at return true else false
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // convert milliseconds to second
    // parse int and base 10
    const changedDate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedDate;
  }
  // false: not changed
  return false;
};

// model
const User = mongoose.model('User', userSchema);
module.exports = User;
