const { response, request }= require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const createQuery = (name, email, role, state = true) => {
    const filter = [];
    let query;
    if (name) {
        filter.push({ name: new RegExp(name, 'i') })
    }
    if (email) {
        filter.push({ email: new RegExp(email, 'i') });
    }
    if (role) {
        filter.push({ role: new RegExp(role, 'i') });
    }
    if (filter.length > 0 ) {
        query = User.find({ $or: filter, $and: [{state}]})
    } else {
        query = User.find({state});
    }
    return query;
};
const usersGet = async (req = request, res = response) => {
    const { page = 0, size = 5, name = '', email = '', role = '' } = req.query;
    const [total, users ] = await Promise.all([
        User.count(),
        createQuery(name,email,role)
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
    res.json({data: userToDelete, userLogged: res.userLogged});
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersGetById
};
