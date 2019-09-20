// 포스트에 관한 api
const express = require('express');
const router = express.Router();

/**
 * @route   GET /posts/test
 * @desc    Test posts route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: 'Success posts test route'
    });
});

module.exports = router;