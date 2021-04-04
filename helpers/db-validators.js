const { User, Category } = require('../models');
const Role = require('../models/role');
const validateUserExistEmail = async (email = '') => {
    const searchMail = await User.findOne({email});
    if (searchMail) {
        throw new Error('Email Already exist');
    }
};
const existsRole = async (role = '') => {
    const searchRole = await Role.findOne({role});
    if (!searchRole) {
        throw new Error(`The Role ${role} is not valid`);
    }
}
const existsUser = async ( id = '' ) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error(`The user ${id} does not exist`);
    }
};
const existsCategory = async ( id = '' ) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error(`The category ${id} does not exist`);
    }
}; 
module.exports = {
    validateUserExistEmail,
    existsRole,
    existsUser,
    existsCategory
};