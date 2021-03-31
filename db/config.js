const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Data base online');
    } catch (error) {
        console.log(error);
        throw new Error('Data base error');
    }
};
module.exports = {
    dbConnection
}