// 포스트에 관한 api
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});
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
                    postItem: post
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

module.exports = router;