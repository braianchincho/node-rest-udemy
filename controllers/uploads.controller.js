const { User, Product } = require('../models');
// const UploadFileCloudinary = require('../controllers/upload-coudinary.controller');
const UploadFileOnServer = require('../controllers/upload-server.controller')
const extensionsImgs = ['png', 'jpg', 'jpge', 'gif'];

// const uploader = new UploadFileCloudinary();
const uploader = new UploadFileOnServer();

const loadGetFile = async (req, res) => {
    const { fileName } = req.params;
    const fileUploader = new UploadFileOnServer();
    const path = fileUploader.getFile(fileName);
    
    if (!path) {
        return res.status(400).json({ message: 'File does not exists' });
    }
    res.sendFile(path);
}


const uploadImgUser = async (req, res) => {
    const { id } = req.params;
    try {
        const fileName= await uploader.saveFile(req.files.file, extensionsImgs);
        const user = await User.findById(id);
        await uploader.deleteFile(user.img);
        user.img = fileName;
        await user.updateOne({img: fileName})
        res.status(201).json({ data: user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving file'})
    }
};
const uploadImgProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const fileName = await uploader.saveFile(req.files.file, extensionsImgs);
        let product = await Product.findById(id);
        await uploader.deleteFile(product.img);
        product.img = fileName;
        
        await product.updateOne({img:fileName});
        res.status(201).json({ data: product})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving file'})
    }
};

module.exports = {
    loadGetFile,
    uploadImgUser,
    uploadImgProduct
};