const form = document.querySelector('form');
const urlLogin = window.location.origin + '/api/auth/login';
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementsByName('email')[0].value;
    const password = document.getElementsByName('password')[0].value;
    loginService(email, password).then(() => {
        document.getElementsByName('email')[0].value = '';
        document.getElementsByName('password')[0].value = '';
    });
});

const loginService = async (email, password) => {
    return fetch(urlLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password})
      }).then(res => {
        return res.json();  
      }).then((res) => {
          if (!res.errors) {
            console.log('login: ',res.data.token);
            sessionStorage.setItem('token', res.data.token);
            window.location = 'chat.html';
            alert('Login success');
          } else {
            alert('Wrong username or password');
          }
      });
};