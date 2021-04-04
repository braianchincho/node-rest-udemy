const { response } = require("express");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { verifyGoogle } = require("../helpers/google-verify");

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
const googleSignIn = async (req, res = response) => {
    const { tokenId } = req.body;
    try {
        const { email, name, img } = await verifyGoogle(tokenId);
        let userDB = await User.findOne({email});
        if (!userDB) {
            userDB = new User({
                email,
                name,
                img,
                google: true,
                password: '=)'
            });
            await userDB.save();
        }
        if (!userDB.state) {
            return res.status(401).json({ message: 'User blocked'})
        }
        const token = await generateJWT(userDB.uid);
        res.json({ data: { userDB, token }})
    } catch (error) {
        res.status(400).json({ message: 'Sign in Failed'})
    }
   
};
module.exports = {
    login,
    googleSignIn
};