// 유저의 관한 api
const express = require('express');
const router = express.Router();

const passport = require('passport');
const checkAuth = passport.authenticate('jwt', {session: false});

// users controller
const userController = require('../controllers/users');

/**
 * @route   GET /users/all
 * @desc    Get user list
 * @access  Public
 */
router.get('/all', userController.users_get_all);

/**
 * @route   POST /users/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', userController.users_post_register);

/**
 * @route   POST /users/signin
 * @desc    User Login (sign in)
 * @access  Public
 */
router.post('/signin', userController.users_post_signin);

/**
 * @route   GET /users/current
 * @desc    Return current user
 * @access  Private
 */
router.get('/current', checkAuth, userController.users_get_current); // passport로 인증

module.exports = router;