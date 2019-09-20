const express = require('express');
const app = express();

/**
 * process.env.PORT에 설정된 PORT가 있으면 사용 없으면 정의한 3000 사용 
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));