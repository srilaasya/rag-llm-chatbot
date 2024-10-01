import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Received request body:', req.body);
            const { website } = req.body;
            console.log('Attempting to crawl website:', website);

            const response = await axios.post('http://127.0.0.1:5000/crawl', { website });

            console.log('Response from Python server:', response.data);
            if (response.data.success) {
                res.status(200).json({ success: true, message: "Crawling complete" });
            } else {
                res.status(500).json({ success: false, error: response.data.error });
            }
        } catch (error) {
            console.error('Error details:', error);
            res.status(500).json({ success: false, error: 'An error occurred during crawling', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}