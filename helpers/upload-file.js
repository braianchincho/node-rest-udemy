const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');

cloudinary.config(process.env.CLOUDINARY_URL)
const uploadFile = (file, extensionsAllowed = [], folder='') => {
    return new Promise( (resolve, reject) => {
        if (!file) {
            reject('Undefined file');
        }
        const extension = getExtension(file.name);
        if (!extensionsAllowed.includes(extension)) {
            reject(`The ${extension} extension is not a permitted extension. 
            The allowed extensions are ${extensionsAllowed}`);
        }
        const nameFile = createName(extension);
        const uploadPath = path.join( __dirname, '../uploads/', folder, nameFile);
        file.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            resolve(nameFile)
        });
    });
}
const createName = ( extension = 'txt') => {
    const time = (new Date()).getTime();
    const random = parseInt((Math.random()* 100_000_000));
    return `${time}-${random}.${extension}`
}
const getExtension = ( nameFile = '') => {
    return nameFile.toLowerCase().split('.').pop()
};
const deleteFile = (fileName, folder = '') => {
    if (fileName) {
        const filePath = path.join( __dirname, '../uploads/', folder, fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
const getFile = (fileName, folder = '') => {
    if (fileName) {
        const filePath = path.join( __dirname, '../uploads/', folder, fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    return null;
};
const uploadFileOnCloudinary = async (file, extensionsAllowed = [], folder='') => {
    if (!file) {
        throw new Error('Undefined file');
    }
    const extension = getExtension(file.name);
    if (!extensionsAllowed.includes(extension)) {
        throw new Error(`The ${extension} extension is not a permitted extension. 
        The allowed extensions are ${extensionsAllowed}`);
    }
    const { tempFilePath } = file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    return secure_url;
}
const deleteFileOnCloudinary = async (fileName, folder = '') => {
    if (fileName) {
       const id = fileName.split('/').pop().split('.')[0]; 
       console.log(id)
       await cloudinary.uploader.destroy(id);
    }
};
module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    uploadFileOnCloudinary,
    deleteFileOnCloudinary 
};