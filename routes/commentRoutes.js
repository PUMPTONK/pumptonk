// routes/commentsRoutes.js
const express = require('express');
const {
  createComment,
  updateComment,
  deleteComment,
  getCommentByTokenAndUser,
  getAllComments,
  searchCommentsByUser,
  getTotalCommentsOnToken,
  getTotalCommentsOnAllTokens,
} = require('../controllers/commentsController');

const router = express.Router();

router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);
router.get('/comments/:tokenId/:userId', getCommentByTokenAndUser);
router.get('/comments', getAllComments);
router.get('/comments/:userId', searchCommentsByUser);
router.get('/comments/total/token/:tokenId', getTotalCommentsOnToken); // New route for total comments on a token
router.get('/comments/total/all', getTotalCommentsOnAllTokens); // New route for total comments on all tokens

module.exports = router;
