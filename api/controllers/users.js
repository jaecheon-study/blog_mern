const jwt = require('jsonwebtoken');
// user avatar 설정을 위한 할당. (프로필 이미지)
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/User');
// 유저 생성 유효 값 검사를 위한 validator
const validateRegisterInput = require('../../validation/register');
// 유저 로그인 유효 값 검사를 위한 validator
const validateSignInInput = require('../../validation/login');

exports.users_get_all = (req, res) => {
    userModel
        .find()
        .exec()
        .then(users => {
            if (!users) {
                return res.status(404).json({
                    msg: 'Not found user list'
                });
            } else {
                res.status(200).json({
                    msg: 'Successful user list',
                    count: users.length,
                    usersInfo: users
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.users_get_current = (req, res) => {
    /**
 * config/passport.js에서 
 * return done(null, user); 성공시 받은 user의 데이터안에 것을 불러온다.
 */
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    });
};

exports.users_post_register = (req, res) => {
    /**
 * 유효 값 확인 req.body -> 사용자 입력 값
 * const {errors, isValid} 는 해당 값이 error이면 errors를 아니면 isValid의 반환 값을 같는다.
 */
    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if (isValid) {
        return res.status(404).json({
            errors: errors
        });
    }

    userModel
        // email 유무 체크, findOne은 컬렉션 항목에서 하나만 찾는다.
        .findOne({ email: req.body.email })
        .exec()
        .then(result => {
            // email이 있을 경우. 즉 기존 회원 가입이 되어있는경우
            if (result) {
                errors.email = 'Email is already exists';
                return res.status(404).json(errors);
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
};

exports.users_post_signin = (req, res) => {
    const { errors, isValid } = validateSignInInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(404).json(errors);
    }

    // email, password
    const email = req.body.email;
    const password = req.body.password;

    // 등록된 유저 찾기
    userModel
        .findOne({ email })
        .exec()
        .then(user => {
            // 등록된 유저가 없는 경우
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json({
                    errors: errors,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:5000/users/register'
                    }
                });
            } else {
                // bcrypt로 암호화 된 비밀번호가 맞는지 비교
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        // 암호가 맞지 않다면
                        if (!isMatch) {
                            errors.password = 'Password incorrect (not matched)';
                            return res.status(404).json({
                                errors: errors
                            });
                        } else {
                            // user matched payload: 유효 탑재량
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            };

                            // sign token
                            jwt.sign(
                                payload,
                                process.env.SECRET,
                                { expiresIn: '1h' },
                                (err, token) => {
                                    if (err) throw err;
                                    res.status(200).json({
                                        success: true,
                                        token: 'Bearer ' + token
                                    });
                                }
                            );

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
};