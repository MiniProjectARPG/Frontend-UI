function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    if (userInput.trim()) {
        appendMessage('user', userInput);
        document.getElementById("userInput").value = '';
    }
}

function appendMessage(sender, message) {
    let messagesDiv = document.getElementById("messages");
    let messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = <div class="bubble">${message}</div>;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}