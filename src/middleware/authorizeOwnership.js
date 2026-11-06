import { getPostById } from '../services/postService.js';

export async function authorizeOwnership(req, res, next) {
  const id = parseInt(req.params.id);
  const post = await getPostById(id);
  if (post.authorId !== req.user.id) {
    const error = new Error('Forbidden: insufficient permission.');
    error.status = 403;
    return next(error);
  }
  next();
}
