const fields = require('./validate-fields');
const roles = require('./validate-role');
const token = require('./validate-token');
const hasFile = require('./validate-file-upload');
module.exports = {
    ...fields,
    ...roles,
    ...token,
    ...hasFile
};