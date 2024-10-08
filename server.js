const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Start Python backend
const pythonProcess = spawn('python', ['backend/api.py']);

pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
});

// Serve static files from the Next.js app
app.use(express.static(path.join(__dirname, 'frontend/.next')));

// Proxy API requests to the Python backend
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true
}));

// Handle Next.js routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/.next/server/pages/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});