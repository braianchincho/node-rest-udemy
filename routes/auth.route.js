const { Router, response } = require('express');
const { check, query } = require('express-validator');
const { login } = require('../controllers/login.controller');
const { validateFields } = require('../middlewares/validate-fields');
const route = Router();
route.post('/', [
    check('email','Email is not valid').isEmail(),
    check('password', 'Password is not valid').isLength({ min: 6 }),
    validateFields
], login);
module.exports = route;