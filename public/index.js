const socket = io();

const chatMessages = document.querySelector('#chat-messages');
const roomSelector = document.querySelector('#room-selector');
const chatWindow = document.querySelector('#chat-window');

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
