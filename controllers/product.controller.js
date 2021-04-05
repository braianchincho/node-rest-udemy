const { request, response } = require("express");
const { Product } = require('../models');
const createFindQuery = (name, description) => {
    const filter = [];
    let productFind;
    if (name) {
        filter.push({ name: new RegExp(name.toUpperCase(), 'i') });
    }
    if (description) {
      filter.push({ description: new RegExp(description, 'i') });   
    }
    if (filter.length > 0 ) {
        productFind =  Product.find({
            $or: filter,
            $and: [{ state: true}] 
        });
    } else {
        productFind = Product.find({ state: true});
    }
    return productFind;
};
const getProducts = async (req = request, res = response) => {
    const { page = 0, size = 5, name = '', description = ''  } = req.query;
    const productFind = createFindQuery(name, description);
    const [ products, total ] = await Promise.all([
        productFind
        .skip(page*size)
        .limit(Number(size))
        .populate('user', 'name')
        .populate('category','name'),
        Product.find({ state: true }).countDocuments()
    ])
    res.json({
        data: {
            products,
            total,
            page,
            size
        }
    })
};
const getProductById = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');
    if (!product || !product.state) {
        res.status(400).json({ data: 'Product do not exists'});
    }

    res.status(200).json({ data: product })
};
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
const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const productData = req.body;
    productData.name = productData.name.toUpperCase();
    const productDB = await Product.findByIdAndUpdate(id, productData, { new: true})
        .populate('category', 'name')
        .populate('user', 'name');

    res.json({ data: productDB });
};
const deleteProduct =  async (req = request, res = response) => {
    const { id } = req.params;
    const productDB = await Product.findByIdAndUpdate(id, { state: false }, { new: true})
        .populate('category', 'name')
        .populate('user', 'name');

    res.json({ data: productDB });
};
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};