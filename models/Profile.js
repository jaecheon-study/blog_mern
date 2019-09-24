const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: { // 유저
        // 유저의 아이디를 가져온다.
        type: Schema.Types.ObjectId,
        ref: 'users' // users collection 참조
    },
    handle: { // 언어
        type: String,
        required: true,
        max: 40
    },
    company: { // 회사
        type: String
    },
    website: { // 웹사이트
        type: String
    },
    location: { // 지역
        type: String
    },
    status: { // 상태
        type: String,
        required: true
    },
    skills: { // 기술
        type: [String], // 여러개 이므로 배열로 타입 지정
        required: true
    },
    bio: { // 성별
        type: String
    },
    githubusername: { // 깃허브 이름
        type: String
    },
    experience: [ // 경력

    ], 
    education: [ // 학력

    ],
    social: { // 소셜 주소

    },
    date: { // 가입 날짜
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('profiles', profileSchema);로 해도 된다. 한번더 명시적으로 적어준 것.
module.exports = Profile = mongoose.model('profiles', profileSchema);