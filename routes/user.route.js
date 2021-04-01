const { Router } = require('express');
const { check, query } = require('express-validator');
const { validateFields }  = require('../middlewares/validate-fields');
const { validateUserExistEmail, existsRole, existsUser } = require('../helpers/db-validators');
const {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersGetById
} = require('../controllers/users.controllers');
const { validateToken } = require('../middlewares/validate-token');
const { hasRole } = require('../middlewares/validate-role');

const route = Router();
route.get('/',[
    query('page').optional().isInt().withMessage('Page should be integer'),
    query('size').optional().isInt().withMessage('Size should be integer'),
    validateFields
], (req, res) => {
    usersGet(req, res);
});
route.get('/:id',[
    check('id').isMongoId(),
    check('id').custom(existsUser),
    validateFields
], usersGetById);
route.post('/', [
    validateToken,
    check('email','Email is not valid').isEmail(),
    check('name','Name is required').notEmpty(),
    check('password', 'Password is not valid').isLength({ min: 6 }),
    check('role').custom(existsRole),
    check('email').custom(validateUserExistEmail),
    validateFields
],
usersPost);

route.put('/:id',[
    validateToken,
    (res, req, next) => hasRole(res,req,next,['ADMIN']),
    check('id').isMongoId(),
    check('id').custom(existsUser),
    validateFields
],(req, res) => {
    usersPut(req, res);
});
route.delete('/:id', [
    validateToken,
    (res, req, next) => hasRole(res,req,next,['ADMIN']),
    check('id', 'Id invalid').isMongoId(),
    check('id').custom(existsUser),
    validateFields
],(req, res) => {
    usersDelete(req, res);
});
module.exports = route;