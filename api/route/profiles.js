// 유저 프로필에 관한 api
const express = require('express');
const router = express.Router();

/**
 * @route   GET /profiles/test
 * @desc    Test profiles route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'Success profiles test router'
    });
});

module.exports = router;