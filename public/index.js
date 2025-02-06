const socket = io();

socket.on('message', (event) => {
    console.log(event);
    if (!event.from_user) return;

    const color = event.from_user === localStorage.getItem('currentUser') ? 'green' : 'blue';
    chatMessages.innerHTML += `<p><span style="color:${color}">${event.from_user}</span>: ${event.message}</p>`;
});

socket.on('event', (event) => {
    console.log(event);
    if (!event.from_user) return;

    const id = `event-${event.from_user}`;

    const existingMessage = chatMessages.querySelector(`#${id}`);
    if (!existingMessage) {
        chatMessages.innerHTML += `<p id=${id}><span style="color:gray">${event.from_user}</span>: ${event.message}</p>`;
        setTimeout(() => {
            document.getElementById(id).remove();
        }, 3000);
    }
});

const loginBlock = document.querySelector('#login');
const chatBlock = document.querySelector('#chat-app');
const loginError = document.querySelector('#login-error');
const chatMessages = document.querySelector('#chat-messages');
const roomSelector = document.querySelector('#room-selector');
const chatWindow = document.querySelector('#chat-window');

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

const roomDropdown = document.querySelector('#room-dropdown');
const joinRoomButton = document.querySelector('#join-room');
joinRoomButton.addEventListener('click', (e) => {
    const room = roomDropdown.value;

    if (!room)
        return;

    roomSelector.classList.add('hidden');
    chatWindow.classList.remove('hidden');

    localStorage.setItem('currentRoom', room);
    socket.emit('joinRoom', { username: localStorage.getItem('currentUser'), room});
});

const leaveRoomButton = document.querySelector('#leave-room');
leaveRoomButton.addEventListener('click', (e) => {
    roomSelector.classList.remove('hidden');
    chatWindow.classList.add('hidden');

    const room = localStorage.getItem('currentRoom');
    socket.emit('leaveRoom', { username: localStorage.getItem('currentUser'), room});
    localStorage.removeItem('currentRoom');
});


const chatForm = document.querySelector('#chat-form');
chatForm.querySelector('#message').addEventListener('keypress', (e) => {
    console.log("User is typing...");
    socket.emit('event', { from_user: localStorage.getItem('currentUser'), message: 'User is typing...' });
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('/api/group', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from_user: localStorage.getItem('currentUser'),
            room: localStorage.getItem('currentRoom'),
            message: e.target.message.value,
        }),
    })
    .then((response) => {
        if (!response.ok)
            throw new Error('Failed to send message');

        return response.json();
    })
    .then((response) => {
        console.log(`Message sent to ${response.data.room}`);
    })
    .catch((error) => {
        console.log(error);
    });
});

const previousLogin = localStorage.getItem('currentUser');
if (previousLogin) {
    authenticate(previousLogin);
}