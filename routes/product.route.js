const { Router } = require('express');
const { check, query } = require('express-validator');
const { existsCategory } = require('../helpers/db-validators');
const { validateToken, validateFields, hasRole } = require('../middlewares');
const { createProduct } = require('../controllers/product.controller');
const route = Router();
route.post('/', [
    validateToken,
    (req, res, next) => hasRole(req,res,next, ['ADMIN']),
    check('name', 'Name is required').notEmpty(),
    check('category', 'Category invalid').isMongoId(),
    check('category').custom(existsCategory),
    validateFields
], createProduct)
module.exports = route;