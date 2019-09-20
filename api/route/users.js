// 유저의 관한 api
const express = require('express');
const router = express.Router();

/**
 * @route   GET /users/test
 * @desc    Test get route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'Success users test router'
    });
});

module.exports = router;