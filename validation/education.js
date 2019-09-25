const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {

    let errors = {};

    // 사용자의 입력 값 체크 required: true 목록만 체크
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy: '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = 'Profile school is required';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Profile degree is required';
    }

    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Profile fieldofstudy is required';
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'Profile from is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};