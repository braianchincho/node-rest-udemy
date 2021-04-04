const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validateToken = async (req = request, res = response, next ) => {
  const token = req.header('token');
  if (!token) {
      return res.status(401).json({ msg: 'Invalid token'});
  }
  try {
      const {uid} = jwt.verify(token, process.env.SECRETKEY);
      const user = await User.findById(uid);
      if (!user || !user.state) {
        return res.status(401).json({message: 'Invalid token - disabled user'})
      }
      req.userLogged = user;
      next();
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid token'});
  }
};
module.exports = { validateToken };