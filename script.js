
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = true;

let listeningForCommand = false;
let commandInProgress = false; // Flag to prevent duplicate commands

// Start listening for "Hello UPI" trigger word
recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    if (transcript === "hello upi" && !listeningForCommand) {
        listeningForCommand = true;
        appendMessage('bot', "Voice command activated! You can now speak your command.");
        recognition.stop(); // Stop listening for "Hello UPI"
        startCommandRecognition(); // Start listening for commands
    } else if (transcript === "stop" && listeningForCommand) {
        listeningForCommand = false;
        appendMessage('bot', "Voice command deactivated.");
        recognition.stop(); // Stop listening for commands
        recognition.start(); // Restart listening for "Hello UPI"
    }
};

// Start the recognition to listen for "Hello UPI"
recognition.start();

function startCommandRecognition() {
    const commandRecognition = new SpeechRecognition();
    commandRecognition.lang = 'en-US';
    commandRecognition.interimResults = false;

    commandRecognition.onresult = function (event) {
        if (commandInProgress) return; // Prevent duplicate handling
        commandInProgress = true; // Mark command processing in progress
        const voiceCommand = event.results[0][0].transcript;
        document.getElementById("chatInput").value = voiceCommand; // Display recognized command in input box
        appendMessage('user', voiceCommand); // Show user's message
        sendMessage(); // Automatically send the recognized command
        commandInProgress = false; // Reset the flag
    };

    commandRecognition.start(); // Start command recognition
}

function sendMessage() {
    let userInput = document.getElementById("chatInput").value;
    if (userInput.trim()) {
        // Process the user command here (e.g., send it to the server)
        document.getElementById("chatInput").value = ''; // Clear input
    }
}

function appendMessage(sender, message) {
    let messagesDiv = document.getElementById("messages");
    let messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = <div class="bubble">${message}</div>;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}
