const { request, response } = require("express");
const { Product } = require('../models');
const createProduct = async (req = request, res = response) => {
    const productData = req.body;
    productData.name = productData.name.toUpperCase();
    const productDB = await Product.findOne({ name:productData.name });
    if (productDB) {
        res.status('400').json({ message: 'Product Already exists' });
    }
    productData.user = req.userLogged._id;
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json({ data: newProduct });
};

module.exports = {
    createProduct
};