import authController from '../controllers/auth.controller';
import authentication from '../middleware/authenticate';
import {Router} from 'express'
import catchAsync from '../middleware/catchAsync';

const {signup, login, protectedRoute, logout, getUser} = authController;
const {authenticate} = authentication;

const authRouter = Router();

authRouter.post('/signup', catchAsync(signup));
authRouter.post('/login', catchAsync(login));
authRouter.post('/logout', catchAsync(logout));
authRouter.get('/user', authenticate, getUser);
authRouter.get('/amiworthy', authenticate, catchAsync(protectedRoute));

export default authRouter;
