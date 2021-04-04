const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/login.controller');
const { validateFields } = require('../middlewares/validate-fields');
const route = Router();
route.post('/login', [
    check('email','Email is not valid').isEmail(),
    check('password', 'Password is not valid').isLength({ min: 6 }),
    validateFields
], login);
route.post('/google', [
    check('tokenId', 'Token id is required').not().isEmpty(),
    validateFields
], googleSignIn);
module.exports = route;