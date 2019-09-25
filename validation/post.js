const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {

    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.content = !isEmpty(data.content) ? data.content : '';

    if (!Validator.isLength(data.title, {min: 10, max: 30})) {
        errors.title = 'Post title must be between 10 and 30 characters';
    }

    if (!Validator.isLength(data.content, {min: 1, max:300})) {
        errors.content = 'Post content must be between 1 and 300 characters';
    }

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Title field is required';
    }

    if (Validator.isEmpty(data.content)) {
        errors.content = 'Content field is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};