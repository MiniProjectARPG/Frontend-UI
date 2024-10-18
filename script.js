// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = true;

let listeningForCommand = false;
let commandInProgress = false; // Prevents duplicate commands

// Start listening for "Hello UPI" trigger word
recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log(`Transcript: ${transcript}`); // Debugging log
    
    if (transcript === "hello upi" && !listeningForCommand && !commandInProgress) {
        listeningForCommand = true;
        commandInProgress = true; // Set this to prevent further processing until command is handled
        appendMessage('bot', "Voice command activated! You can now speak your command.");
        recognition.stop(); // Stop listening for "Hello UPI"
        startCommandRecognition(); // Start listening for a single command
    }
};

// Ensure recognition restarts if it unexpectedly stops
recognition.onend = function() {
    if (!listeningForCommand && !commandInProgress) {
        recognition.start(); // Keep listening for "Hello UPI" if recognition is stopped unexpectedly
    }
};

// Start listening for "Hello UPI"
recognition.start();

function startCommandRecognition() {
    const commandRecognition = new SpeechRecognition();
    commandRecognition.lang = 'en-US';
    commandRecognition.interimResults = false;
    
    // Handle the user's command once recognized
    commandRecognition.onresult = function (event) {
        if (!commandInProgress) return; // Prevent duplicate handling
        const voiceCommand = event.results[0][0].transcript;
        document.getElementById("chatInput").value = voiceCommand; // Display recognized command in input box
        appendMessage('user', voiceCommand); // Show user's message
        sendMessage(); // Automatically send the recognized command
        
        // Stop listening for commands and reset state
        commandRecognition.stop(); // Stop listening after handling one command
        listeningForCommand = false; // Reset command listening
        appendMessage('bot', "Command processed. Say 'Hello UPI' to activate voice command again.");
        
        // Restart recognition to listen for "Hello UPI" again
        recognition.start(); // Restart listening for "Hello UPI"
        
        // Allow commands to be processed again
        commandInProgress = false;
    };

    commandRecognition.onend = function() {
        // We stop after processing a single command, no need to restart
        if (!listeningForCommand && !commandInProgress) {
            recognition.start(); // If no command is in progress, restart recognition for "Hello UPI"
        }
    };

    commandRecognition.start(); // Start listening for a single command
}

function sendMessage() {
    let userInput = document.getElementById("chatInput").value;
    if (userInput.trim()) {
        appendMessage('user', userInput); // Display the user's message in the chat
        // Process the user command here (e.g., send it to the server)
        document.getElementById("chatInput").value = ''; // Clear the input box
    }
}

function appendMessage(sender, message) {
    let messagesDiv = document.getElementById("messages");
    let messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `<div class="bubble">${message}</div>`; // Corrected the innerHTML
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
