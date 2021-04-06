const { Router } = require('express');
const { check } = require('express-validator');
const { uploadImgUser, uploadImgProduct, loadGetFile } = require('../controllers/uploads.controller');
const { existsUser, existsProduct } = require('../helpers/db-validators')
const { validateFields } = require('../middlewares/validate-fields');
const { hasFile } = require('../middlewares')
const route = Router();
route.post('/users/:id', [
    check('id').isMongoId(),
    check('id').custom(existsUser),
    hasFile,
    validateFields
] ,uploadImgUser);
route.post('/products/:id', [
    check('id').isMongoId(),
    check('id').custom(existsProduct),
    hasFile,
    validateFields
] ,uploadImgProduct);
route.get('/:fileName', loadGetFile)
module.exports = route;