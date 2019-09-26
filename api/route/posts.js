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
 * @route   POST /posts/like/:postId
 * @desc    Like post
 * @access  Private
 */
router.post('/like/:postId', authCheck, (req, res) => {
    
    const postId = req.params.postId;
    const userId = req.user.id;

    // 어떤 유저가 like를 눌렀는지
    profileModel
        .findOne({user: userId})
        .exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).json({
                    msg: 'Not Found user'
                });
            } else {
                postModel
                    .findById(postId)
                    .exec()
                    .then(post => {
                        if (!post) {
                            return res.status(404).json({
                                msg: 'Not found post item'
                            });
                        } else {
                            // 한 개의 게시물에 한번만 누름
                            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                                return res.status(403).json({
                                    msg: 'User already liked this post'
                                });
                            } else {
                                // Add user id to likes array
                                post.likes.unshift({user: userId});
                                post
                                    .save()
                                    .then(post => {
                                        res.status(200).json({
                                            msg: 'Successful like this post',
                                            postInfo: post
                                        });
                                    })
                                    .catch(err => {
                                        res.status(502).json({
                                            error: err
                                        });
                                    });
                            }
                        }
                    })
                    .catch(err => {
                        res.status(501).json({
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
});

/**
 * @route   POST /posts/unlike/:postId
 * @desc    Unlike post
 * @access  Private
 */
router.post('/unlike/:postId', authCheck, (req, res) => {

    const userId = req.user.id;
    const postId = req.params.postId;

    // 유저가 해당 게시글에 좋아요를 눌렀는지 확인
    profileModel
        .findOne({user: userId})
        .exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).json({
                    msg: 'Not found user'
                });
            } else {

                postModel
                    .findById(postId)
                    .exec()
                    .then(post => {
                        if (!post) {
                            return res.status(404).json({
                                msg: 'Not found post'
                            });
                        } else {
                            if (post.likes.filter(like => like.user.toString() === userId).length === 0) {
                                return res.status(400).json({
                                    notliked: 'You have not liked this post'
                                });
                            }

                            // Get remove index
                            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(userId);

                            // splice out of array
                            post.likes.splice(removeIndex, 1);

                            // save
                            post
                                .save()
                                .then(post => {
                                    if (!post) {
                                        return res.status(404).json({
                                            msg: 'Not found post'
                                        });
                                    } else {
                                        res.status(200).json({
                                            msg: 'Successful unlike this post'
                                        });
                                    }
                                })
                                .catch(err => {
                                    res.status(501).json({
                                        error: err
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        res.status(501).json({
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
});

/**
 * @route   POST /posts/comment/:postId
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/comment/:postId', authCheck, (req, res) => {
    
    const postId = req.params.postId;
    const userId = req.user.id;

    const {errors, isValid} = validatePostInput(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json({
            error: errors
        });
    } else {
        postModel
            .findById(postId)
            .exec()
            .then(post => {
                if (!post) {
                    return res.status(404).json({
                        msg: 'Not found post'
                    });
                } else {
                    const newComment = {
                        text: req.body.text,
                        name: req.body.name,
                        avatar: req.body.avatar,
                        user: userId
                    };

                    // add to comments array
                    post.comments.unshift(newComment);

                    // save
                    post
                        .save()
                        .then(post => {
                            if (!post) {
                                return res.status(404).json({
                                    msg: 'Not found post'
                                });
                            } else {
                                res.status(200).json({
                                    msg: 'Successful comment to post',
                                    comments: post.comments,
                                    postInfo: post
                                });
                            }
                        })
                        .catch(err => {
                            res.status(501).json({
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
    }
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

/**
 * 게시글 아이디와 댓글 아이디가 필요하다.
 * 해당 게시글의 댓글을 삭제 해야 하기 때문
 * @route   DELETE /posts/comment/:postId/:commentId
 * @desc    Remove comment
 * @access  Private
 */
router.delete('/comment/:postId/:commentId', authCheck, (req, res) => {

    const postId = req.params.postId;
    const commentId = req.params.commentId;

    postModel
        .findById(postId)
        .exec()
        .then(post => {
            // 해당 게시글에 댓글이 없다면
            if (post.comments.filter(comment => comment._id.toString() === commentId).length === 0) {
                return  res.status(404).json({
                    msg: 'Comment does not exist'
                });
            } else {
                // 삭제할 인덱스
                const removeIndex = post.comments.map(item => item._id.toString()).indexOf(commentId);
                
                post.comments.splice(removeIndex, 1);
                post
                    .save()
                    .then(post => {
                        if (!post) {
                            return res.status(404).json({
                                msg: 'Not found post'
                            });
                        } else {
                            res.status(200).json({
                                msg: 'Successful remove comment',
                                postInfo: post,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:5000/posts/' + postId
                                }
                            });
                        }
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
});

module.exports = router;