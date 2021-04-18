const urlRefreshToken = `${window.location.origin}/api/auth/refreshToken`;
let socket;
// referencias html
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');

async function validateToken() {
    const token = sessionStorage.getItem('token');
    const res = await fetch(urlRefreshToken, {
        method: 'POST',
        headers: { token },
    });
    const {data} = await res.json();
    return data;
}

async function connectSocket(token = '') {
    socket = io({
        extraHeaders: {
            token
        }
    });
    socket.on('conect', () => {});
    socket.on('disconect', () => {});
    socket.on('private-message', (payload) => {
        console.log('from: ', payload.from);
        console.log('message: ', payload.message)
    })
    socket.on('receive-message', (payload) => {
        messages = payload;
        updateMessages();
    });
    socket.on('active-users', (payload) => {
        console.log('users active', payload);
        updateList(payload);
    });
}
async function sendMessage({key}) {
    const message = txtMessage.value;
    const uid = txtUid.value;
    if (key === 'Enter') {
        socket.emit('send-message', {message, uid});
        txtMessage.value = '';
    }
}
function updateList(users = []) {
    let ulContent = '';
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
function signOut() {

    localStorage.removeItem('token');

    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then( () => {
        console.log('User signed out.');
    }).finaly(() => window.location = 'index.html');
}
function updateMessages() {
    let template = '';
    messages.forEach(({name, message}) => {
        template += `<li><span class="text-primary">${name}</span>: ${message} </li>`;
    });
    ulMessages.innerHTML = template;
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
txtMessage.addEventListener('keyup', sendMessage);

// (()=>{
//     gapi.load('auth2', () => {
//         gapi.auth2.init();
//         main();
//     });
// })();

main();
