const cloudinary = require('cloudinary');
const FileUploader = require('../models/file-uploader');

cloudinary.config(process.env.CLOUDINARY_URL)
class UploadFileCloudinary extends FileUploader {
    async saveFile(file, extensionsAllowed) {
        if (!file || !file.name) {
            throw new Error('Undefined file');
        }
        const extension = file.name.split('.').pop();
        if (!extensionsAllowed.includes(extension)) {
            throw new Error(`The ${extension} extension is not a permitted extension. 
            The allowed extensions are ${extensionsAllowed}`);
        }
        const { tempFilePath } = file;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        return secure_url;
    }

    async deleteFile(fileName) {
        if (fileName) {
            const id = fileName.split('/').pop().split('.')[0]; 
            console.log(id)
            await cloudinary.uploader.destroy(id);
        }
    }
}

module.exports = UploadFileCloudinary;