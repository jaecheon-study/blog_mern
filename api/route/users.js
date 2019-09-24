// 유저의 관한 api
const express = require('express');
const router = express.Router();
// user avatar 설정을 위한 할당. (프로필 이미지)
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/User');

/**
 * @route   GET /users/test
 * @desc    Test get route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'Success users test router'
    });
});

/**
 * @route   POST /users/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', (req, res) => {

    userModel
        // email 유무 체크, findOne은 컬렉션 항목에서 하나만 찾는다.
        .findOne({email: req.body.email})
        .exec()
        .then(result => {
            // email이 있을 경우. 즉 기존 회원 가입이 되어있는경우
            if (result) {
                return res.status(404).json({
                    msg: 'Email is already exists'
                });
            } else {
                // 이미지 자동 생성 (avatar 자동 생성) 이메일 주소 기준
                const avatar = gravatar.url(req.body.email, {
                    // avatar 이미지 옵션
                    s: '200', // size
                    r: 'pg',    // Rating
                    d: 'mm' // default
                });

                // 유저 생성
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,// 값이 없으면 기본 이미지로 들어감.
                    password: req.body.password
                });

                // password 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    // newUser의 입력된 password를 가져옴, salt 반환 값, err와 has를 반환한다.
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        // 생성 유저 저장
                        newUser
                            .save()
                            .then(result => {
                                res.json(result);
                            })
                            .catch(err => res.json(err));
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