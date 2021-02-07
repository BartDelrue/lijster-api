import passportJWT from '../services/passport/config';
import { ApplicationError } from '../helpers/errors';
import List from '../models/list.model';

export default {
  authenticate: (req, res, next) => {
    passportJWT.authenticate('jwt', {session: false}, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        throw new ApplicationError(401, 'invalid token, please log in or sign up');
      }
      req.user = user;
      return next();
    })(req, res, next);
  },
  isOwner: async (req, res, next) => {
    try {
      const list = await List.findOne({_id:req.params.id, owner: req.user._id});
      if (!list) {
        return next({statusCode: 404})
      }
    } catch (e) {
      next({statusCode: 404})
    }

    return next();
  },
  isPublic: async (req, res, next) => {
    const list = await List.findOne({_id:req.params.id, public: true});
    if (!list) {
      return next({statusCode: 404})
    }
    return next();
  }
};
