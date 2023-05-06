const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typingMessage = document.getElementById('typing-message')

  // Play sound if message is received
  const audio = new Audio('pip.wav');





const name = prompt('What is your name?')
appendMessage('You joined', true)
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name} : ${data.message}`, false)
  typingMessage.innerText = ''
})

socket.on('user-connected', name => {
  const messageId = Date.now().toString()
  appendMessage(`${name} : joined the room`, false, messageId)
})

socket.on('user-disconnected', name => {
  const messageId = Date.now().toString()
  appendMessage(`${name} : Leaved the room`, false, messageId)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  if (message.length >0){
    appendMessage(`You: ${message}`, true)
    socket.emit('send-chat-message', message)
  
  }
  messageInput.value = ''
  typingMessage.innerText = ''
})

messageInput.addEventListener('input', () => {
  if (messageInput.value) {
    socket.emit('typing')
  } else {
    socket.emit('stop-typing')
  }
})

socket.on('typing', name => {
  typingMessage.innerText = `${name} is typing...`
})

socket.on('stop-typing', () => {
  typingMessage.innerText = ''
})

function appendMessage(message, isSent, messageId) {
  const messageElement = document.createElement('div')
  messageBox = document.createElement('div') 
  messageBox.classList.add('messageSec')
  messageElement.innerText = message
  messageElement.classList.add('message')
  if (isSent) {
    messageElement.classList.add('sent')
    messageBox.classList.add('right')
  } else {
    messageElement.classList.add('received')
    messageBox.classList.add('left')
    audio.play();
  }
  if (messageId) {
    messageElement.id = messageId
  }
  messageBox.append(messageElement)
  messageContainer.append(messageBox)
  messageContainer.scrollTop = messageContainer.scrollHeight;

}