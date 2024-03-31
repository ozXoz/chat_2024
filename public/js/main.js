const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log("Username and room from URL:", username, room);

// Join room
socket.emit("joinRoom", { username, room });
console.log(`Attempted to join room: ${room} as ${username}`);

// Incorrect event name corrected from 'jointRoom' to 'joinRoom'
socket.on("joinRoom", ({ username, room }) => {
  console.log(`${username} has joined the room: ${room}`);
});

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  console.log(`Room: ${room}, with users:`, users);
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log("Message from server:", message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get msg text
  const msg = e.target.elements.msg.value;
  console.log("Message submitted:", msg);

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Display when user sends a message on chat side
function outputMessage(message) {
  console.log("Outputting message:", message);
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  console.log(`Setting room name in the DOM: ${room}`);
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  console.log("Updating user list in the DOM");
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}



