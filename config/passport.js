// passport-jwt
const jwtStrategy = require('passport-jwt').Strategy; // Strategy (전략) passport의 플러그인들은 사용하려면 전략을 짜주어야 한다.
const ExtractJwt = require('passport-jwt').ExtractJwt; 

// 로그인시 발급이니 userModel을 불러옴
const userModel = require('../models/User');
// 인증 관련 value 담을 객체
const opts = {};

// header에 bearertoken을 넣는다.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

module.exports = (passport) => {
    // console.log(passport);
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            userModel
                .findById(jwt_payload.id)
                .exec()
                .then(user => {
                    // console.log(user);
                    // 유저가 없다면
                    if (!user) {
                        // db 접근 시 발생하는 서버 에러, 성공 했을 시 return 값, 3번째 아규먼트는 msg를 넣을 수 있다 {msg: 'ex'}}
                        return done(null, false);
                    } else {
                        // 유저가 있으면 user를 반환
                        return done(null, user);
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
    );
};