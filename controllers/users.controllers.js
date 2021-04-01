const { response, request }= require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const usersGet = async (req = request, res = response) => {
    const { page = 0, size = 5 } = req.query;
    const active = {state: true};
    const [total, users ] = await Promise.all([
        User.count(),
        User.find(active)
        .skip(Number(page)*Number(size))
        .limit(Number(size))
    ]);
    res.json({data: users, page, size, total});
}
const usersGetById = async (req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json({data: user});
}
const usersPost = async (req, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    // cifrar contraseña
    const salt = bcrypt.genSaltSync(12);
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    res.json({data: user});
}
const usersPut  = async (req, res = response) => {
    const { id } = req.params;
    const { google, password, email, role, ...user } = req.body;
    if (password) {
        const salt = bcrypt.genSaltSync(12);
        user.password = bcrypt.hashSync(password, salt);
    }
    const userToUpdate = await User.findByIdAndUpdate(id, user);
    res.json({ data: userToUpdate });
}
const usersDelete = async (req, res = response) => {
    const { id } = req.params;
    const userToDelete = await User.findByIdAndUpdate(id, {state: false});
    res.json({data: userToDelete});
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersGetById
};
