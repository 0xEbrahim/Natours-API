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
  role: {
    type: String,
    enum: ['user', 'guide', 'admin', 'lead-guide'],
    default:'user'
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false
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
  },
  passwordChangedAt: {
    type: Date,
    default: new Date('90-03-28')
  }
});

userSchema.pre('save', async function(next) {
  // This function will only run if the password is modified

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.matchPassword = async (candiPassword, password) => {
  return await bcrypt.compare(candiPassword, password);
};

userSchema.methods.changedPasswordAfter = function(JWT_TimeStamps) {
  const changedTimeStamps = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return changedTimeStamps > JWT_TimeStamps;
};

export default mongoose.model('User', userSchema);
