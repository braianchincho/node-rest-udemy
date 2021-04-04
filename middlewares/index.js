const fields = require('./validate-fields');
const roles = require('./validate-role');
const token = require('./validate-token');
module.exports = {
    ...fields,
    ...roles,
    ...token
};