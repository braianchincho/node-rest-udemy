const { request, response } = require('express');
const User = require('../models/user');

const hasRole = async (req = request, res = response, next, roles = []) => {
    const { role } = res.userLogged;
    if (roles.includes(role)) {
        next();
        return;
    }
    res.status(403).json({ mesagge: 'Not authorized'})
}
module.exports = {
    hasRole
};