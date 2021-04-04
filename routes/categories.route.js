const { Router } = require('express');
const { check, query } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { postCategory, putCategory, getCategories, getCategoryById, deleteCategory } = require('../controllers/categories.controller');
const { validateToken } = require('../middlewares/validate-token');
const { existsCategory } = require('../helpers/db-validators');
const { hasRole } = require('../middlewares/validate-role');
const route = Router();
// public
route.get('', [
    query('page').isNumeric().optional(),
    query('size').isNumeric().optional(),
    validateFields
], getCategories);
// public
route.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    validateFields
], getCategoryById);
// private
route.post('/', [
    validateToken,
    check('name', 'Name is required').notEmpty(),
    validateFields
] ,postCategory);

// private
route.put('/:id', [
    validateToken,
    check('name', 'Name is required').notEmpty(),
    check('id', 'Id invalid').isMongoId(),
    check('id').custom(existsCategory),
    validateFields
], putCategory);

// private admiin
route.delete('/:id', [
    validateToken,
    (res, req, next) => hasRole(res,req,next,['ADMIN']),
    check('id', 'Id invalid').isMongoId(),
    check('id').custom(existsCategory),
] ,deleteCategory)

module.exports = route;