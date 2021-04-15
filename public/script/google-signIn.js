var url = window.location.origin + '/api/auth/google';
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ tokenId: id_token})
    }).then(res => {
      return res.json();  
    }).then(({data}) => {
      console.log('google',data);
      debugger
      if (data && data.token) {
        sessionStorage.setItem('token', data.token);
        window.location = 'chat.html';
      }
    });
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}
  