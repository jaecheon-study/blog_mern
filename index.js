/**
 * .env의 설정한 환경 변수 사용을 위해 dotenv 할당
 * 변수에 할당하지 않고 바로 require('dotenv').config();를 사용해도 된다.
 * .env에는 서버의 중요한 자료를 모아둔다.
 */
const dotenv = require('dotenv');
// dotenv에 있는 설정 값 사용.
dotenv.config();
const express = require('express');
const app = express();
//process.env.PORT에 설정된 PORT가 있으면 사용 없으면 정의한 3000 사용 
const PORT = process.env.SERVER_PORT || 3000;
const mongoose = require('mongoose');

const morgan = require('morgan');
const bodyParser = require('body-parser');

// 라우터 설정
const postsRouter = require('./api/route/posts');
const profilesRouter = require('./api/route/profiles');
const usersRouter = require('./api/route/users');

mongoose.connect(process.env.MONGO_URL, {dbName: 'blog_mern', useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => console.log(`MongoDb Connect...`))
    .catch(err => console.log(`error: ${err}`));

// morgan 설정
app.use(morgan('dev'));
// body-parser 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 라우터 경로 설정 (첫번 째 아규먼트 경로 주소, 두번 째 아규먼트 라우터 파일 위치)
app.use('/posts', postsRouter);
app.use('/profiles', profilesRouter);
app.use('/users', usersRouter);



app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));