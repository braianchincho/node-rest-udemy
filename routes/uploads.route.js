const { Router } = require('express');
const { check } = require('express-validator');
const { postUploadFile, uploadImgUser, uploadImgProductOnCloudinary, loadGetFile, uploadImgUserOnCloudinary } = require('../controllers/uploads.controller');
const { existsUser, existsProduct } = require('../helpers/db-validators')
const { validateFields } = require('../middlewares/validate-fields');
const { hasFile } = require('../middlewares')
const route = Router();
route.post('/', [hasFile] , postUploadFile);
route.post('/users/:id', [
    check('id').isMongoId(),
    check('id').custom(existsUser),
    hasFile,
    validateFields
] ,uploadImgUserOnCloudinary);
route.post('/products/:id', [
    check('id').isMongoId(),
    check('id').custom(existsProduct),
    hasFile,
    validateFields
] ,uploadImgProductOnCloudinary);
route.get('/:collection/:fileName', loadGetFile)
module.exports = route;