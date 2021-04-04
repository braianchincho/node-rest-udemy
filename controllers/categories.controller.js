const { request, response } = require('express');
const { Category } = require('../models');
const postCategory = async (req = request, res= response) => {
    const name = req.body.name.toUpperCase();
    const user = req.userLogged;
    let category = await Category.findOne({name})
    if (category) {
        return res.status(400).json({ message: `Category ${name} already exists`})
    }
    category = new Category({name, user: user._id, state: true});
    await category.save();
    res.status(201).json({ data: category})

};
const putCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { name, user: req.userLogged._id}, { new: true});
    res.json({ data: category });
};
const getCategories = async (req = request, res = response) => {
    const { page = 0, size = 5 } = req.query;
    const [ categories, total ] = await Promise.all([
        Category.find({state: true})
        .skip(page*size)
        .limit(Number(size))
        .populate('user', 'name'),
        Category.countDocuments({state: true})
    ]);

    res.json({ 
        data: {
            categories,
            total,
            page,
            size
        }
    });
};
const getCategoryById = async (req = request, res = response) => {
    const category = await Category.findById(req.params.id).populate('user', 'name');
    if (!category || !category.state) {
        res.json({ message: 'Category do not exists'})
    }
    res.json({ data: category});
};
const deleteCategory = async (req = request, res = response) => {
    const category = await Category.findByIdAndUpdate(req.params.id, { state: false});
    res.json({ data: category});
};
module.exports = { postCategory, putCategory, getCategories, getCategoryById, deleteCategory };