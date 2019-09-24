// 유저 프로필에 관한 api
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const userModel = require('../../models/User');
const profileModel = require('../../models/Profile');

const passport = require('passport');
const checkAuth = passport.authenticate('jwt', {session: false});

/**
 * @route   GET /profiles/test
 * @desc    Test profiles route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'Success profiles test router'
    });
});

/**
 * @route   GET /profiles/current
 * @desc    Get users current profile
 * @access  Private
 */
router.get('/current', checkAuth, (req, res) => {

    const errors = {};

    const id = req.user.id;

    profileModel
        .findOne({user: id}) // profile Schema의 user collection id
        .exec()
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user id';
                return res.status(404).json({
                    error: errors
                });
            } else {
                res.status(200).json({
                    profile: profile
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