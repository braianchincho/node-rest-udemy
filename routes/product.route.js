const { Router } = require('express');
const { check, query } = require('express-validator');
const { existsCategory, existsProduct } = require('../helpers/db-validators');
const { validateToken, validateFields, hasRole } = require('../middlewares');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const route = Router();
route.post('/', [
    validateToken,
    check('name', 'Name is required').notEmpty(),
    check('category', 'Category invalid').isMongoId(),
    check('category').custom(existsCategory),
    validateFields
], createProduct);
route.put('/:id', [
    validateToken,
    check('name', 'Name is required').notEmpty(),
    check('category', 'Category invalid').isMongoId(),
    check('category').custom(existsCategory),
    check('id', 'Id is invalid').isMongoId(),
    check('id').custom(existsProduct),
    validateFields
], updateProduct);
route.get('/', [
    query('page').isNumeric().optional(),
    query('size').isNumeric().optional(),
    validateFields
], getProducts);
route.get('/:id', [
    check('id').isMongoId(),
    validateFields
], getProductById);
route.delete('/:id', [
    validateToken,
    (req, res, next) => hasRole(req, res, next, ['ADMIN']),
    check('id', 'Id is invalid').isMongoId(),
    check('id').custom(existsProduct),
    validateFields
], deleteProduct)
module.exports = route;