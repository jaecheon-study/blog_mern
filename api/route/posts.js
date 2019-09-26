// 포스트에 관한 api
const express = require('express');
const router = express.Router();

const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});

const postController = require('../controllers/posts');

/**
 * @route   GET /posts/all
 * @desc    Get post all list
 * @access  Public
 */
router.get('/all', postController.posts_get_all);

/**
 * @route   POST /posts/register
 * @desc    Register post
 * @access  Private
 */
router.post('/register', authCheck, postController.posts_post_register);

/**
 * @route   GET posts/:postId
 * @desc    Get post item
 * @access  Public
 */
router.get('/:postId', postController.posts_get_detail);

/**
 * @route   POST /posts/like/:postId
 * @desc    Like post
 * @access  Private
 */
router.post('/like/:postId', authCheck, postController.posts_detail_like);

/**
 * @route   POST /posts/unlike/:postId
 * @desc    Unlike post
 * @access  Private
 */
router.post('/unlike/:postId', authCheck, postController.posts_detail_unlike);

/**
 * @route   POST /posts/comment/:postId
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/comment/:postId', authCheck, postController.posts_detail_comment);

/**
 * @route   DELETE /posts/:postId
 * @desc    Remove post item
 * @access  Private
 */
router.delete('/:postId', authCheck, postController.posts_delete);

/**
 * 게시글 아이디와 댓글 아이디가 필요하다.
 * 해당 게시글의 댓글을 삭제 해야 하기 때문
 * @route   DELETE /posts/comment/:postId/:commentId
 * @desc    Remove comment
 * @access  Private
 */
router.delete('/comment/:postId/:commentId', authCheck, postController.posts_delete_comment);

module.exports = router;