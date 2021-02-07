import { Strategy } from 'passport-local';
import passport from 'passport';

import User from '../../models/user.model';

const authFields = {
  usernameField: 'email',
  _passwordField: 'password',
  _passReqToCallback: true
};

passport.use(
  'login', new Strategy(authFields, async (email, password, done) => {
    try {
      const user = await User.findOne({email: email});

      if (!user || !user.password) {
        return done(null, false, {message: 'Incorrect email or password.'});
      }

      const checkPassword = await user.comparePassword(password);

      if (!checkPassword) {
        return done(null, false, {message: 'Incorrect email or password'});
      }

      return done(null, user);
    }
    catch (e) {
      return done(null, false, {statusCode: 400, message: e.message});
    }
  })
);

passport.use(
  'signup', new Strategy(authFields, async (email, password, done) => {
    try {
      const checkEmail = await User.checkExistingField('email', email);

      if (checkEmail) {
        // todo: security issue, data exposure
        return done(null, false, {
          statusCode: 409,
          message: 'Email already registered, log in instead'
        });
      }

      const newUser = new User();
      newUser.email = email;
      newUser.password = password;

      await newUser.save();
      return done(null, newUser);
    }
    catch (e) {
      return done(null, false, {statusCode: 400, message: e.message});
    }

  })
);
