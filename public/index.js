const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

const currentUser = null;

const loginForm = document.querySelector('#login-form');
const loginBlock = document.querySelector('#login');
const chatBlock = document.querySelector('#chat-app');

const loginError = document.querySelector('#login-error');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
        }),
    })
    .then((response) => {
        if (!response.ok)
            throw new Error('Invalid username and password');

        chatBlock.classList.remove('hidden');
        loginBlock.classList.add('hidden');
    })
    .catch((error) => {
        console.log(error);
        console.log(loginError);
        loginError.innerHTML = error.message;
    });

});
