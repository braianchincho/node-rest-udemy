const { Schema, model} = require('mongoose');
const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    state: {
        type: Boolean,
        required: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
    
});
CategorySchema.methods.toJSON = function() {
    const { __v, _id, ...category } = this.toObject();
    category.uid = _id;
    category.user = deconstructUser(category.user);
    return category
}; 
const deconstructUser = (user) => {
    const { _id, name } = user;
    return { uid: _id, name };
}; 
module.exports = model('Category', CategorySchema);