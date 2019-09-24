// open source로 validator 구현
const Validator = require('validator');
const isEmpty = require('./is-empty');

// 사용자 입력값 모듈로 내보냄
module.exports = function validateRegisterInput(data) {
    console.log(data);
    // 에러를 담을 객체
    let errors = {};

    // 사용자 입력 값 확인
    data.name = !isEmpty(data.name) ? data.name : ''; // name 입력 값이 없으면 공백
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    // 최소, 최대 문자열 길이 validator에서 제공하는 최소, 최대 길이. 
    if (!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    // 입력 값 확인
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name Field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email Field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Password2 field is required';
    }

    // email 형식 확인, Validator에서 기본 제공하는 함수 isEmail()
    if (Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // password 길이 확인
    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    // password와 password2가 서로 맞는지 확인, Validator에서 기본 제공하는 함수 equals()
    if (Validator.equals(password, password2)) {
        errors.password2 = 'Password must match';
    }

    // errors와 isValid를 반환한다.
    return {
        errors,
        isValid: isEmpty(errors)
    };
};