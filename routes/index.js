const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUser = require('../controller/searchUser');

const wallpaperRoutes = require('./wallpaper');
const groupRoutes = require('./groupRoutes'); // ✅ matches your actual file

const router = express.Router();

// ✅ Mount wallpaper routes under /user
router.use('/user', wallpaperRoutes);

// ✅ Mount group routes under /group
router.use('/group', groupRoutes);

/* ------------------------------------------------------------- */
/* User Authentication & Profile Routes */
/* ------------------------------------------------------------- */

// Create new user (Registration)
router.post('/register', registerUser);

// Check if email exists
router.post('/email', checkEmail);

// Check password for login
router.post('/password', checkPassword);

// Get user details (used in dashboard, chat, etc.)
router.get('/user-details', userDetails);

// Logout user
router.get('/logout', logout);

// Update profile (name, pic)
router.post('/update-user', updateUserDetails);

// Search users by name/email
router.post('/search-user', searchUser);

/* ------------------------------------------------------------- */

module.exports = router;
