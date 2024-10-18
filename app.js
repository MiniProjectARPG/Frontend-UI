function processUserCommand(command) {
    fetch('http://127.0.0.1:5000/process_command', { // Make sure the URL matches your Flask server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: command })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.reply) {
            appendMessage('bot', data.reply);
        } else {
            appendMessage('bot', 'No reply received from the server.');
        }
    })
    .catch(error => {
        appendMessage('bot', 'Error processing the command.');
        console.error('Error:', error);
    });
}
