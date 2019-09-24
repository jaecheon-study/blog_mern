const mongoose = require('mongoose');
const schema = mongoose.Schema;

// user schema 생성
const userSchema = new Schema({
    // name 속성에 type과 require설정. type은 형태 (문자열, 숫자 등등), require는 필수 값.
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date.now
    }
});

module.exports = User = mongoose.model('Users', userSchema);