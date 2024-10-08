const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const { spawn } = require('child_process');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const port = process.env.PORT || 3000;

// Start Python backend
const pythonProcess = spawn('python', ['backend/api.py']);

pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
});

// Proxy API requests to the Python backend
server.use('/api', createProxyMiddleware({
    target: 'https://rag-llm-chatbot-b66d8f1f51a1.herokuapp.com/', // Replace with your actual Heroku app URL
    changeOrigin: true
}));

// Handle Next.js routing
server.all('*', (req, res) => {
    return handle(req, res);
});

// Start the server
app.prepare().then(() => {
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server running on port ${port}`);
    });
});