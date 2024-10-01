import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Received chat message:', req.body.message);
            const response = await axios.post('http://127.0.0.1:5000/chat', { message: req.body.message });
            console.log('Response from Flask server:', response.data);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error processing chat:', error);
            res.status(500).json({ error: 'An error occurred during chat processing', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}