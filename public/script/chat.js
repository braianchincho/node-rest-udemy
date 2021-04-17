const urlRefreshToken = `${window.location.origin}/api/auth/refreshToken`;

// referencias html
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const liTemplate = `
<li class="list-group-item">
<div class="d-flex justify-content-between">
    <img 
        src="{{img}}" 
        alt="{{alt-description}}" 
        width="100" 
        height="100">
    <div>
        <h4>{{name}}</h4>
        <p><strong>UID:</strong> {{id}}</p>
    </div>
    <div></div>
</div>
</li>
`;
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
    connectSocket(data.token);
    document.title = data.user.name;
}
async function connectSocket(token = '') {
    const socket = io({
        extraHeaders: {
            token
        }
    });
    socket.on('conect', () => {});
    socket.on('disconect', () => {});
    socket.on('receive-message', () => {});
    socket.on('active-users', (payload) => {
        console.log('users active', payload);
        updateList(payload);
    });
}
async function sendMessage() {

}
function updateList(users = []) {
    let ulContent = '';
    users.forEach(user => {
        ulContent += `${liTemplate}`
        .replace('{{name}}', user.name)
        .replace('{{id}}', user.uid)
        .replace('{{img}}', user.img)
        .replace('{{alt-description}}', `image avatar ${user.uid}`);
        ulContent += '\n';
    });
    ulUsers.innerHTML = ulContent;
}
main();
console.log('socket');