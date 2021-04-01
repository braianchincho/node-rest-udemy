const { response } = require("express");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const login = async (req, res = response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, state: true });
    if (!user) {
        return errorLogin(res)
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return errorLogin(res);
    }
    try {
        const token = await generateJWT(user.id);
        res.json({data: { token, user } });
    } catch(err) {
        res.status(500).json({message: 'Error on login', err});
    }
};
const errorLogin = (res= response) => {
    return res.status(401).json({
        message: 'Incorrect user or password'
    });
}

module.exports = {
    login
};