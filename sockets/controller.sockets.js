const { Socket } = require("socket.io");
const { getUserByJWT } = require("../helpers/generate-jwt");
const Chat = require('../models/chat');
const chat = new Chat();
const socketController = async (socket = new Socket(), io) => {
    const user = await getUserByJWT(socket.handshake.headers.token)
    if (!user) {
        console.log('Socket Desconectado: ', socket.id);
        return socket.disconnect();
    }
    chat.connectUser(user);
    // crear sala
    socket.join(user.id);
    io.emit('active-users', chat.usersArray);
    io.emit('receive-message', chat.lastMessages(10));
    socket.on('disconnect', () => {
        chat.disconnectUser(user.id);
        io.emit('active-users', chat.usersArray);
    });

    socket.on('send-message', ({message, uid}) => {
        
        if (uid) {
            socket.to(uid).emit('private-message', { from: user, message});
        } else {
            chat.sendMessage(user.id, user.name, message);
            io.emit('receive-message', chat.lastMessages(10));
        }
        
    });
    console.log('cliente conectado ', user.name)
};

module.exports = {
    socketController    
};