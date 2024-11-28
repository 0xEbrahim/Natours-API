import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    trim: true,
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords did not match'
    }
  }
});

userSchema.pre('save', async function(next) {
  // This function will only run if the password is modified

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

export default mongoose.model('User', userSchema);
