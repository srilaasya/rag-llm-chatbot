export default async function handler(req, res) {
    const { companyName } = req.query;

    console.log('Received company name:', companyName);

    if (!companyName || companyName === 'undefined' || companyName === 'null') {
        console.log('Company name not provided, using default greeting');
        const defaultGreeting = `Hi, I am trained on the company's website you provided. I'm here to help you with queries regarding the company and its services. Ask away!`;
        return res.status(200).json({ response: defaultGreeting });
    }

    console.log('Generating greeting for company:', companyName);
    const greeting = `Hi, I am ${companyName}'s AI assistant. Here to help you with queries regarding ${companyName} and its products. Ask away!`;
    res.status(200).json({ response: greeting });
}