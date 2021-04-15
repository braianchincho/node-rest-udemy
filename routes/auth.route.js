const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renovateToken } = require('../controllers/login.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateToken } = require('../middlewares/validate-token');
const route = Router();
route.post('/login', [
    check('email','Email is not valid').isEmail(),
    validateFields
], login);
route.post('/google', [
    check('tokenId', 'Token id is required').not().isEmpty(),
    validateFields
], googleSignIn);
route.post('/refreshToken', [
   validateToken
], renovateToken);
module.exports = route;