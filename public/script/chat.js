const urlRefreshToken = `${window.location.origin}/api/auth/refreshToken`;

// referencias html

const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
async function validateToken() {
    const token = sessionStorage.getItem('token');
    const res = await fetch(urlRefreshToken, {
        method: 'POST',
        headers: { token },
    });
    const {data} = await res.json();
    return data;
}

async function main() {
    const data = await validateToken();
    if (data) {
        sessionStorage.setItem('token', data.token)
    } else {
        window.location = window.location.origin;
        return;
    }
    conectSocket(data.token);
    document.title = data.user.name;
}
async function conectSocket(token = '') {
    const socket = io({
        extraHeaders: {
            token
        }
    });
    socket.on('conect', () => {});
    socket.on('disconect', () => {});
    socket.on('receive-message', () => {});
    socket.on('active-users', () => {});
}
async function sendMessage() {

}
main();
console.log('socket')