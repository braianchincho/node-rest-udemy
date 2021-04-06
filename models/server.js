const express = require('express');
const cors = require('cors')
const db = require('../db/config');
const fileUpload = require('express-fileupload');
class Server {
  
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
        this.conectDb();
    }
    async conectDb() {
        await db.dbConnection();
    }
    routes() {
        this.app.use('/api/auth', require('../routes/auth.route'));
        this.app.use('/api/categories', require('../routes/categories.route'));
        this.app.use('/api/products', require('../routes/product.route'));
        this.app.use('/api/users', require('../routes/user.route'));
        this.app.use('/api/uploads', require('../routes/uploads.route'));
    }
    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(cors());
        // parseo de request body a json
        this.app.use(express.json());
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Run in http://localhost:${this.port}`)
        });
    }

}
module.exports = Server;