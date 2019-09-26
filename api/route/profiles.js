// 유저 프로필에 관한 api
const express = require('express');
const router = express.Router();
const passport = require('passport');
const checkAuth = passport.authenticate('jwt', {session: false});

const profileController = require('../controllers/profiles');

/**
 * @route   GET /profiles/all
 * @desc    Get all profile list
 * @access  Public
 */
router.get('/all', profileController.profiles_get_all);

/**
 * 다른 유저의 정보
 * @route   GET /profiles/user/:userId
 * @desc    Get profile by userId
 * @access  Private
 */
router.get('/user/:userId', checkAuth, profileController.profiles_get_user);

/**
 * @route   GET /profiles/myinfo
 * @desc    Get users current profile
 * @access  Private
 */
router.get('/myinfo', checkAuth, profileController.profiles_get_myInfo);

/**
 * 유저 자신이 자신의 프로필을 작성해야만 한다.
 * @route   POST /profiles/register
 * @desc    User profile register
 * @access  Private
 */
router.post('/register', checkAuth, profileController.profiles_post_register);

/**
 * @route   POST /profiles/education/register
 * @desc    Add education to profile
 * @access  Private
 */
router.post('/education/register', checkAuth, profileController.profiles_post_education_register);

/**
 * @route   POST /profile/experience/register
 * @desc    Register experience to profile
 * @access  Private
 */
router.post('/experience/register', checkAuth, profileController.profiles_post_experience_register);

/**
 * 유저 정보는 해당 유저만 변경해야 한다.
 * @route   PATCH /profiles
 * @desc    Modify user profile
 * @access  Private
 */
router.patch('/', checkAuth, profileController.profiles_patch);

/**
 * 프로필은 권한이 있는 사람이 삭제
 * @route   DELETE /profiles/:profileId
 * @desc    Remove user profile
 * @access  Private
 */
router.delete('/:profileId', checkAuth, profileController.profiles_delete);

/**
 * @route   DELETE /profiles/experience/:expId
 * @desc    Remove experience to profile
 * @access  Private
 */
router.delete('/experience/:expId', checkAuth, profileController.profiles_delete_experience);

/**
 * @route   DELETE /profiles/education/:eduId
 * @desc    Remove education to profile
 * @access  Private
 */
router.delete('/education/:eduId', checkAuth, profileController.profiles_delete_education);

module.exports = router;