const loginBlock = document.querySelector('#login');
const chatBlock = document.querySelector('#chat-app');
const loginError = document.querySelector('#login-error');

function authenticate(username) {
    localStorage.setItem('currentUser', username);
    document.querySelector('#current-user span').innerHTML = `Welcome, ${username}!`;
    chatBlock.classList.remove('hidden');
    loginBlock.classList.add('hidden');
}

const loginForm = document.querySelector('#login-form');
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

        return response.json();
    })
    .then((data) => {
        console.log(`Logged in as ${data.username}`);
        authenticate(data.username);
    })
    .catch((error) => {
        console.log(error);
        console.log(loginError);
        loginError.innerHTML = error.message;
    });
});

const signUpForm = document.querySelector('#sign-up-form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;

    fetch('/api/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
            password: e.target.password.value,
        }),
    })
    .then((response) => {
        if (!response.ok)
            throw new Error('Failed to sign up');

        return response.json();
    })
    .then((data) => {
        console.log(`User created with ID: ${data.user_id}`);
        authenticate(username);
    })
    .catch((error) => {
        console.log(error);
        loginError.innerHTML = error.message;
    });
});

const logoutButton = document.querySelector('#logout-button');
logoutButton.addEventListener('click', (e) => {
    localStorage.removeItem('currentUser');
    chatBlock.classList.add('hidden');
    loginBlock.classList.remove('hidden');
});

const previousLogin = localStorage.getItem('currentUser');
if (previousLogin) {
    authenticate(previousLogin);
}
