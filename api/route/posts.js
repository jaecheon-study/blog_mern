// 포스트에 관한 api
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});
// 작성자 확인을 위한 profileModel
const profileModel = require('../../models/Profile');
const postModel = require('../../models/Post');
const validatePostInput = require('../../validation/post');


/**
 * @route   GET /posts/all
 * @desc    Get post all list
 * @access  Public
 */
router.get('/all', (req, res) => {
    postModel
        .find()
        .sort({date: -1}) // 최신날짜순 : -1, 오래된 날짜순 : 1
        .populate('user', ['name', 'avatar'])
        .exec()
        .then(posts => {
            if (!posts) {
                return res.status(404).json({
                    msg: 'Not found post list'
                });
            } else {
                res.status(200).json({
                    msg: 'Successful post list',
                    count: posts.length,
                    postList: posts
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

/**
 * @route   POST /posts/register
 * @desc    Register post
 * @access  Private
 */
router.post('/register', authCheck, (req, res) => {
    
    const {errors, isValid} = validatePostInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(500).json({
            error: errors
        });
    }

    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content,
        avatar: req.body.avatar,
        user: req.user.id
    });

    // post save
    newPost
        .save()
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    msg: 'Register post fail'
                });
            } else {
                res.status(200).json({
                    msg: 'Success register post',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/posts/all'
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

/**
 * @route   GET posts/:postId
 * @desc    Get post item
 * @access  Public
 */
router.get('/:postId', (req, res) => {

    // postId 할당
    const id = req.params.postId;
    
    postModel
        .findById(id)
        .exec()
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    msg: 'Not found post'
                });
            } else {
                res.status(200).json({
                    msg: 'Successful post item',
                    postItem: post,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/posts/all'
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

/**
 * @route   DELETE /posts/:postId
 * @desc    Remove post item
 * @access  Private
 */
router.delete('/:postId', authCheck, (req, res) => {
    
    const userId = req.user.id;
    const postId = req.params.postId;

    // 작성자 확인
    profileModel
        .findOne({user: userId})
        .exec()
        .then(profile => {
            // console.log(profile);
            postModel
                .findById({_id: postId})
                .exec()
                .then(post => {
                    // console.log(post);
                    // check for post owner
                    if (post.user.toString() !== userId) {
                        return res.status(404).json({
                            noauthorized: 'User not authorized'
                        });
                    } else {
                        post
                            .remove({_id: postId})
                            .then(() => {
                                res.status(200).json({
                                    msg: 'Successful remove post item',
                                    success: true
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;