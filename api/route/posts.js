// 포스트에 관한 api
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});

const postModel = require('../../models/Post');

/**
 * @route   GET /posts/test
 * @desc    Test posts route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'Success posts test route'
    });
});

module.exports = router;