// controllers/commentsController.js
const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
  try {
    const { tokenId, userId, content } = req.body;
    const comment = await Comment.create({ tokenId, userId, content });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

exports.getCommentByTokenAndUser = async (req, res) => {
  try {
    const { tokenId, userId } = req.params;
    const comment = await Comment.findOne({ where: { tokenId, userId } });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comment', error });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comments', error });
  }
};

exports.searchCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const comments = await Comment.findAll({ where: { userId } });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error searching comments', error });
  }
};

exports.getTotalCommentsOnToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const totalComments = await Comment.count({ where: { tokenId } });
    res.json({ tokenId, totalComments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving total comments on token', error });
  }
};

exports.getTotalCommentsOnAllTokens = async (req, res) => {
  try {
    const totalComments = await Comment.count();
    res.json({ totalComments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving total comments on all tokens', error });
  }
};
