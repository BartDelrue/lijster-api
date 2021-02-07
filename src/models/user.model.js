import List from './list.model';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema(
  {
    userName: {
      type: String
    },
    email: {
      type: String,
      validate: [isEmail, 'please provide a valid email address'],
      required: true,
      unique: true
    },
    email_is_verified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: 8
    },
    date: {
      type: Date,
      default: Date.now
    },
    lists: [{
      type: Schema.Types.ObjectId,
      ref: 'List'
    }]
  },
  {strict: false}
);

UserSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next;
  }

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.HASH)
  );

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj =user.toObject();
  delete userObj.password;
  return userObj;
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
  return jwt.sign({id: this._id}, jwtPrivateSecret, {
    expiresIn: '10d',
    algorithm: 'RS256'
  });
};

UserSchema.statics.checkExistingField = async (field, value) => {
  return User.findOne({[`${field}`]: value});
};

const User = mongoose.model('User', UserSchema);

export default User;
