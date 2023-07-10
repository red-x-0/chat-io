var socket = io();

var messages = document.getElementById('chat-box');
var send = document.getElementById('send-form');
var input = document.getElementById('message-input');
var uname = document.getElementById('uname')
const usernameC = prompt('Enter your username:');
let createMsg = (iClass, msg, username) => {
  var messages = document.getElementById('chat-box');
  messages.innerHTML += ` 
  <div class="chat ${iClass}">
    <div class="details">
        <p>${username}: ${msg}</p>
    </div>
  </div>`;

  messages.scrollTo({
    top: messages.scrollHeight,
    behavior: "smooth"
  })
};
let join = () => {
  socket.emit('join', `${usernameC}`);
  createToast('success', `succesed join as ${usernameC}`);
  uname.textContent = usernameC;
};
send.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value, usernameC);
    input.value = '';
  }
});
socket.on('msgsArr', (msgArr) => {
  msgArr.forEach(msg => {
    if (msg.username.toLowerCase() === usernameC.toLowerCase()) {
      iClass = 'outgoing';
    } else {
      iClass = 'incoming';
    }
    createMsg(iClass, msg.msg, msg.username)
  });
  createToast('success', `messages loaded succesfly`)
  let audio = new Audio('/click.mp3');
  audio.play()
})
socket.on('join', (username) => {
  createToast('info', `${username} joined`)
  console.log(`${username} has joined`);
})
socket.on('disconnected', (id,username) => {
  createToast('info', `${username} disconnected`)
  console.log(`${username} has disconnected id:${id}`);
})
let iClass = '';
socket.on('chat message', function (msg, username) {
  if (username.toLowerCase() === usernameC.toLowerCase()) {
    iClass = 'outgoing';
  } else {
    iClass = 'incoming';
    createToast('info', `${username}: ${msg}`)
    let audio = new Audio('/click.mp3');
    audio.play()
  }
  createMsg(iClass, msg, username)
});

// toast notifiction
const notifications = document.querySelector(".notifications"),
  buttons = document.querySelectorAll(".buttons .btn");
// Object containing details for different types of toasts
const toastDetails = {
  timer: 7000,
  success: {
    icon: 'fa-circle-check',
    text: 'Success: This is a success toast.',
  },
  error: {
    icon: 'fa-circle-xmark',
    text: 'Error: This is an error toast.',
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    text: 'Warning: This is a warning toast.',
  },
  info: {
    icon: 'fa-circle-info',
    text: 'Info: This is an information toast.',
  }
}
const removeToast = (toast) => {
  toast.classList.add("hide");
  if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
  setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}
const createToast = (id, text) => {
  if (!text) {
    text = toastDetails[id].text
  }
  // Getting the icon and text for the toast based on the id passed
  const { icon } = toastDetails[id];
  const toast = document.createElement("li"); // Creating a new 'li' element for the toast
  toast.className = `toast ${id}`; // Setting the classes for the toast
  // Setting the inner HTML for the toast
  toast.innerHTML = `<div class="column">
                    <i class="fa-solid ${icon}"></i>
                    <span>${text}</span>
                  </div>
                  <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)">X</i>`;
  notifications.appendChild(toast); // Append the toast to the notification ul
  // Setting a timeout to remove the toast after the specified duration
  toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}
// Adding a click event listener to each button to create a toast when clicked
buttons.forEach(btn => {
  btn.addEventListener("click", () => createToast(btn.id));
});
join();