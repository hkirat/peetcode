const express = require('express');
const { signup } = require('../controllers/user.controller');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validator/auth.validator');
const { isSignedIn } = require('../middleware');
const router = express.Router();

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
// router.post('/signin', validateSigninRequest, isRequestValidated, signin);

module.exports = router;
