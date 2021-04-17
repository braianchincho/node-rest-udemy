const { Socket } = require("socket.io");
const { getUserByJWT } = require("../helpers/generate-jwt");
const Chat = require('../models/chat');
const chat = new Chat();
const socketController = async (socket = new Socket(), io) => {
    const user = await getUserByJWT(socket.handshake.headers.token)
    if (!user) {
        console.log('Socket Desconectado: ', socket.id);
        return socket.disconect();
    }
    chat.connectUser(user);

    io.emit('active-users', chat.usersArray);
    console.log('cliente conectado ', user.name)
};

module.exports = {
    socketController    
};