// 로그인 값 체크
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validationSignInInput(data) {

    // 에러를 담을 객체
    let errors = {};

    // email과 password 빈칸 확인
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // email이 빈칸이라면
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    // password가 빈칸이라면
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // email 형식 확인
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // errors와 isValid 리턴
    return {
        errors,
        isValid : isEmpty(errors)
    }

};