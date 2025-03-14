const WebSocket = require('ws');

// Create WebSocket server on a different port (e.g., 8080)
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('Connected successfully');
});

console.log('WebSocket server running on port 8080'); 