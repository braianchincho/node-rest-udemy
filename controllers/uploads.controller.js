const { uploadFile, deleteFile, getFile, uploadFileOnCloudinary, deleteFileOnCloudinary  } = require('../helpers/upload-file');
const { User, Product } = require('../models');

const extensionsImgs = ['png', 'jpg', 'jpge', 'gif'];

const saveFile = async (req, res, extensions = extensionsImgs, folder = '' ) => {
    const { file } = req.files;
    const fileName = await uploadFile(file, extensions, folder);
    return fileName;
}  
const postUploadFile = async (req, res ) => {
    try {
        const fileName = await saveFile(req, res);
        res.status(201).json({ data: {fileName}})
    } catch (error) {
        res.status(500).json({ message: 'Error saving file'})
    }
}; 
const uploadImgUser = async (req, res) => {
    const { id } = req.params;
    try {
        const fileName = await saveFile(req, res, extensionsImgs, 'users');
        const user = await User.findById(id);
        deleteFile(user.img, 'users');
        user.img = fileName;
        await user.updateOne({img: fileName})
        res.status(201).json({ data: user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving file'})
    }
}
const uploadImgProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const fileName = await saveFile(req, res, extensionsImgs, 'products');
        let product = await Product.findById(id);
        deleteFile(product.img, 'products')
        product.img = fileName;
        
        await product.updateOne({img:fileName});
        res.status(201).json({ data: product})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving file'})
    }
};
const loadGetFile = async (req, res) => {
    const { collection, fileName } = req.params;
    const path = getFile(fileName, collection);
    if (!path) {
        return res.status(400).json({ message: 'File does not exists' });
    }
    res.sendFile(path);
}

// ***********************************   CLOUDINARY   *********************************** 

const uploadImgUserOnCloudinary = async (req, res) => {
    const { id } = req.params;
    try {
        const fileName= await uploadFileOnCloudinary(req.files.file, extensionsImgs);
        const user = await User.findById(id);
        await deleteFileOnCloudinary(user.img);
        user.img = fileName;
        await user.updateOne({img: fileName})
        res.status(201).json({ data: user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving file'})
    }
};
const uploadImgProductOnCloudinary = async (req, res) => {
    const { id } = req.params;
    try {
        const fileName = await uploadFileOnCloudinary(req.files.file, extensionsImgs);
        let product = await Product.findById(id);
        await deleteFileOnCloudinary(product.img);
        product.img = fileName;
        
        await product.updateOne({img:fileName});
        res.status(201).json({ data: product})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving file'})
    }
};

module.exports = {
    postUploadFile,
    uploadImgUser,
    uploadImgProduct,
    loadGetFile,
    uploadImgUserOnCloudinary,
    uploadImgProductOnCloudinary
};