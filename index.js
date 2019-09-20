/**
 * .env의 설정한 환경 변수 사용을 위해 dotenv 할당
 * 변수에 할당하지 않고 바로 require('dotenv').config();를 사용해도 된다.
 */
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

/**
 * process.env.PORT에 설정된 PORT가 있으면 사용 없으면 정의한 3000 사용 
 */
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));