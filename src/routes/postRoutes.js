import express from 'express';
import {
  getAllPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from '../controllers/postController.js';

import {
  validateId,
  validateCreatePost,
  validateUpdatePost,
  validatePostQuery,
} from '../middleware/postValidators.js';

import { authenticate } from '../middleware/authenticate.js';
import { authorizeOwnership } from '../middleware/authorizeOwnership.js';

const router = express.Router();
router.get('/', validatePostQuery, getAllPostsHandler);
router.get('/:id', validateId, getPostByIdHandler);
router.post('/', authenticate, validateCreatePost, createPostHandler);
router.put(
  '/:id',
  authenticate,
  validateId,
  authorizeOwnership,
  validateUpdatePost,
  updatePostHandler,
);
router.delete(
  '/:id',
  authenticate,
  validateId,
  authorizeOwnership,
  deletePostHandler,
);

export default router;
