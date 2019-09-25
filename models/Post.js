const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [

    ],
    comments: [

    ],
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('posts', postSchema);