const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');
const FileUploader = require('../models/file-uploader');

cloudinary.config(process.env.CLOUDINARY_URL)

class UploadFileOnServer extends FileUploader {

    async saveFile(file, extensionsAllowed) {
        return new Promise( (resolve, reject) => {
            if (!file || !file.name ) {
                return reject('Undefined file');
            }
            const extension = file.name.split('.').pop();
            if (!extensionsAllowed.includes(extension)) {
                return reject(`The ${extension} extension is not a permitted extension. 
                The allowed extensions are ${extensionsAllowed}`);
            }
            const nameFile = this.createName(extension);
            const uploadPath = path.join( __dirname, '../uploads/', nameFile);
            file.mv(uploadPath, (err) => {
                if (err) {
                    return reject(err)
                }
                resolve(nameFile)
            });
        });
    }

    async deleteFile(fileName) {
        if (fileName) {
            const filePath = path.join( __dirname, '../uploads/', fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
    createName = ( extension = 'txt') => {
        const time = (new Date()).getTime();
        const random = parseInt((Math.random()* 100_000_000));
        return `${time}-${random}.${extension}`
    }
    
    getFile(fileName) {
        if (fileName) {
            const filePath = path.join( __dirname, '../uploads/', fileName);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }
        return null
    }
}

module.exports = UploadFileOnServer;