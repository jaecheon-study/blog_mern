// 유저 프로필에 관한 api
const express = require('express');
const router = express.Router();

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
 * @route   GET /profiles/myinfo
 * @desc    Get users current profile
 * @access  Private
 */
router.get('/myinfo', checkAuth, (req, res) => {

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

/**
 * 유저 자신이 자신의 프로필을 작성해야만 한다.
 * @route   POST /profiles/register
 * @desc    User profile register
 * @access  Private
 */
router.post('/register', checkAuth, (req, res) => {

    // user id 할당
    const id = req.user.id;
    let errors = {};
    // Get fields
    const profileFields = {};
    profileFields.user = id;
    
    // 입력 값 할당
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    /**
     * Skill - Split into array
     * skill은 배열로 들어오니 , 기준으로 자름 
     */
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};

    // 유저 아이디로 프로필 확인
    profileModel
        .findOne({user: id})
        .exec()
        .then(profile => {
            // 유저가 작성한 프로필이 있을 때
            if (profile) {
                errors.alreadyprofile = 'User profile already';
                return res.status(404).json({
                    error: errors
                });
            } else {
                profileModel
                    .findOne({handle: profileFields.handle})
                    .exec()
                    .then(profile => {
                        // 작성 제목이 있다면
                        if (profile) {
                            errors.handle = 'That handle already exists';
                            return res.status(404).json({
                                error: errors
                            });
                        } else {
                            // 작성이 제목이 없다면
                            new profileModel(profileFields)
                                .save()
                                .then(profile => {
                                    res.status(200).json({
                                        msg: 'Successful register user profile',
                                        profile: profile
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
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;