const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = true;  // Keeps listening

        let listeningForCommand = false;

        // On result of voice recognition
        recognition.onresult = function(event) {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();

            if (transcript.toLowerCase() === "hello upi") {
                listeningForCommand = true;
                appendMessage('bot', "Voice command activated! You can now speak your command.");
                startCommandRecognition();
            }
        };

        // Start listening for "Hello UPI" trigger word
        recognition.start();

        // Function to listen to user commands after "Hello UPI" is triggered
        function startCommandRecognition() {
            const commandRecognition = new SpeechRecognition();
            commandRecognition.lang = 'en-US';
            commandRecognition.interimResults = false;

            commandRecognition.onresult = function(event) {
                const voiceCommand = event.results[0][0].transcript;
                document.getElementById("userInput").value = voiceCommand;  // Set recognized voice command in input box
                sendMessage();  // Automatically send the recognized command
                listeningForCommand = false;
            };

            commandRecognition.start();  // Start command recognition
        }

        function sendMessage() {
            let userInput = document.getElementById("userInput").value;
            if (userInput.trim()) {
                appendMessage('user', userInput);
                processUserCommand(userInput);
                document.getElementById("userInput").value = '';  // clear input
            }
        }

        function appendMessage(sender, message) {
            let messagesDiv = document.getElementById("messages");
            let messageElement = document.createElement('div');
            messageElement.classList.add('message', sender);
            messageElement.innerHTML = <div class="bubble">${message}</div>;
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;  // scroll to bottom
        }

        function processUserCommand(command) {
            fetch('/process_command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: command })
            })
            .then(response => response.json())
            .then(data => {
                appendMessage('bot', data.reply);
            });
        }

