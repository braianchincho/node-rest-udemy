class FileUploader {
    /** 
     *  @param  {Object} file  Is a value of form-data request
     *  @param  {String []} extensionsAllowed List of Extensions allowed for example '.txt' '.png'
     *  @return {String}  filename this can be a url of an external repository or the filename
     *  within the server's file system 
     */
    async saveFile(file, extensionsAllowed) {}
    /**
     *  @param  {String} fileName URL of the file in case it is saved in an external repository 
     *  and the file name in case it is saved in the server
     *  @return void
     */
    async deleteFile(fileName) {}
}
module.exports = FileUploader;