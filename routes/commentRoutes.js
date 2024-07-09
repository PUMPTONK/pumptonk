// routes/commentsRoutes.js
const express = require('express');
const {
  createComment,
  updateComment,
  deleteComment,
  getCommentByTokenAndUser,
  getAllComments,
  searchCommentsByUser,
} = require('../controllers/commentsController');

const router = express.Router();

router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);
router.get('/comments/:tokenId/:userId', getCommentByTokenAndUser);
router.get('/comments', getAllComments);
router.get('/comments/:userId', searchCommentsByUser);

module.exports = router;
