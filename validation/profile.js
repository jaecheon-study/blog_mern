// profile validation
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {

    let errors = {};

    // require: true인 목록들만 체크
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Profile Status is required';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Profile Skills is required';
    }

    // 최소 2자, 최대 40자
    if (!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Profile handle must be between 2 and 40 characters';
    }

    // 웹 사이트 목록이 빈칸이 아니면
    if (!isEmpty(data.website)) {
        // 웹사이트 url 형식이 아니라면
        if (!validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};