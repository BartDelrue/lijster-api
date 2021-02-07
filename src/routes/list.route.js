import { Router } from 'express';
import catchAsync from '../middleware/catchAsync';
import authentication from '../middleware/authenticate';
import listController from '../controllers/list.controller';

const {authenticate, isOwner} = authentication;
const {
  getForAuthenticatedUser,
  add,
  getById,
  addItem,
  deleteItem,
  deleteList,
  updateList,
  getAnonymousById
} = listController;

const listRouter = Router();

listRouter.get('/all', authenticate, catchAsync(getForAuthenticatedUser));
listRouter.post('/add', authenticate, catchAsync(add));

listRouter.get('/:id', authenticate, isOwner, catchAsync(getById));
listRouter.patch('/:id', authenticate, isOwner, catchAsync(updateList))
listRouter.delete('/:id', authenticate, isOwner, catchAsync(deleteList));

listRouter.post('/:id', authenticate, isOwner, catchAsync(addItem));
listRouter.delete('/:id/:item', authenticate, isOwner, catchAsync(deleteItem));

listRouter.get('/public/:id', catchAsync(getAnonymousById))

export default listRouter;

