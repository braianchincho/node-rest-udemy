const jwt = require('jsonwebtoken');
const User = require('../models/user');
const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        jwt.sign({uid}, process.env.SECRETKEY, {expiresIn: '1h'},(err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject(err)
            }
        });
    });
};
const getUserByJWT = async (token = '') => {
    try {
        const { uid } = await jwt.verify(token, process.env.SECRETKEY);
        const user = await User.findById(uid);
        return (user && user.state) ? user : null; 
    } catch (error) {
        return null
    }
};

module.exports = { generateJWT, getUserByJWT };