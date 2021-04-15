const { Socket } = require("socket.io");
const { getUserByJWT } = require("../helpers/generate-jwt");

const socketController = async (socket = new Socket()) => {
    const user = await getUserByJWT(socket.handshake.headers.token)
    if (!user) {
        console.log('Socket Desconectado: ', socket.id);
        return socket.disconect();
    }
    console.log('cliente conectado ', user.name)
};

module.exports = {
    socketController    
};