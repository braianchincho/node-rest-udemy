const jwt = require('jsonwebtoken');

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

module.exports = { generateJWT };