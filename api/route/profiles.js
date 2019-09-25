// 유저 프로필에 관한 api
const express = require('express');
const router = express.Router();

const profileModel = require('../../models/Profile');
const passport = require('passport');
const checkAuth = passport.authenticate('jwt', {session: false});
// validate 모듈 추가
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');

/**
 * @route   GET /profiles/all
 * @desc    Get all profile list
 * @access  Public
 */
router.get('/all', (req, res) => {
    
    profileModel
        .find()
        .populate('user', ['name', 'avatar']) // user collection에서 name과 avatar 가져옴
        .exec()
        .then(profiles => {
            if (!profiles) {
                return res.status(404).json({
                    msg: 'There is no profile info'
                });
            } else {
                res.status(200).json({
                    count: profiles.length,
                    profileList: profiles
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
 * 다른 유저의 정보
 * @route   GET /profiles/user/:userId
 * @desc    Get profile by userId
 * @access  Private
 */
router.get('/user/:userId', checkAuth, (req, res) => {

    const errors = {};
    const userId = req.params.userId;

    profileModel
        .findOne({user: userId})
        .populate('user', ['name', 'avatar'])
        .exec()
        .then(profile => {
            // 유저에 대한 프로필이 없을 때 (못찾을 때)
            if (!profile) {
                errors.noProfile = 'Not found user profile';
                return res.status(404).json({
                    error: errors
                });
            } else {
                res.status(200).json({
                    userProfile: profile
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
 * @route   GET /profiles/myinfo
 * @desc    Get users current profile
 * @access  Private
 */
router.get('/myinfo', checkAuth, (req, res) => {

    const errors = {};
    const id = req.user.id;

    profileModel
        .findOne({user: id}) // profile Schema의 user collection id
        .populate('user', ['name', 'avatar']) // user에 대한 name과 avatar정보도 보여줌
        .exec()
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user id';
                return res.status(404).json({
                    error: errors
                });
            } else {
                res.status(200).json({
                    profile: profile,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/profiles/all'
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
 * 유저 자신이 자신의 프로필을 작성해야만 한다.
 * @route   POST /profiles/register
 * @desc    User profile register
 * @access  Private
 */
router.post('/register', checkAuth, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(404).json({
            error: errors
        });
    }

    // user id 할당
    const id = req.user.id;
   
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

/**
 * @route   POST /profiles/education/register
 * @desc    Add education to profile
 * @access  Private
 */
router.post('/education/register', checkAuth, (req, res) => {

    const {errors, isValid} = validateEducationInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(404).json({
            msg: errors
        });
    }

    profileModel
        .findOne({user: req.user.id})
        .exec()
        .then(profile => {
            // 해당 유저의 프로필이 없다면
            if (!profile) {
                return res.status(404).json({
                    msg: 'Not found user profile'
                });
            } else {
                // education 속성에 넣어줄 데이터
                const newEdu = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };

                // Add to exp array in profile.education
                profile.education.unshift(newEdu);
                
                profile 
                    .save()
                    .then(profile => {
                        // 유저의 프로필이 없다면
                        if (!profile) {
                            return res.status(404).json({
                                msg: 'Not found user profile'
                            });
                        } else {
                            res.status(200).json({
                                msg: 'Successful user profile education',
                                educationInfo: profile.education,
                                profileInfo: profile
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

/**
 * 유저 정보는 해당 유저만 변경해야 한다.
 * @route   PATCH /profiles
 * @desc    Modify user profile
 * @access  Private
 */
router.patch('/', checkAuth, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(404).json({
            error: errors
        });
    }

    // Get fields
    const profileFields = {};
    // 로그인 유저 아이디 할당
    profileFields.user = req.user.id;
    
    // 해당 필드 값 할당.
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Spilt into array
    if (typeof profileFields.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};

    // 유저 아이디로 프로필 찾음
    profileModel
        .findOne({user: req.user.id})
        .exec()
        .then(profile => {
            // 유저의 프로필이 없으면
            if (!profile) {
                errors.noprofile = 'Not Found user profile';
                return res.status(404).json({
                    errors: errors
                });
            } else {
                // profile update
                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id}, // 유저의 아이디로 찾음
                        {$set: profileFields}, // 변경 될 내용들
                        {new: true} // findOneAndUpdate에서 필히 사용해야한다. 변경 된 내용으로 보여주는 옵션
                    )
                    .exec()
                    .then(profile => {
                        if (!profile) {
                            errors.cannotupdate = 'can not update user profile';
                            return res.status(404).json({
                                errors: errors
                            });
                        } else {
                            res.status(200).json({
                                msg: 'Successful modify user profile',
                                userProfile: profile,
                                request: {
                                    type: "GET",
                                    url: 'http://localhost:5000/users/all'
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

/**
 * 프로필은 권한이 있는 사람이 삭제
 * @route   DELETE /profiles/:profileId
 * @desc    Remove user profile
 * @access  Private
 */
router.delete('/:profileId', checkAuth, (req, res) => {
    
    const id = req.params.profileId;
    const errors = {};

    profileModel
        .remove({_id: id})
        .exec()
        .then(result => {
            errors.cannotremove = 'Remove user profile fail';
            // 삭제 실패
            if (!result) {
                return res.status(404).json({
                    error: errors
                });
            } else {
                res.status(200).json({
                    msg: 'Successful remove user profile',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/profiles/all'
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

module.exports = router;