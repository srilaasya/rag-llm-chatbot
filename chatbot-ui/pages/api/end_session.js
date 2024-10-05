import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post('http://127.0.0.1:5000/end_session');
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error ending session:', error);
            res.status(500).json({ error: 'An error occurred while ending the session' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}