const { Schema, model} = require('mongoose');
const ProductSchema = Schema({
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
    },
    price: { type: Number, default: 0 },
    description: { type: String },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    available: { type: Boolean, default: true },
    img: { type: String}
    
});
ProductSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}; 

module.exports = model('Product', ProductSchema);