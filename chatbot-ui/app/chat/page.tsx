'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatInterface from '../../components/ChatInterface'

interface Message {
    sender: string;
    content: string;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [companyName, setCompanyName] = useState<string>('')
    const searchParams = useSearchParams()

    useEffect(() => {
        console.log('Chat page mounted');
        extractCompanyNameAndFavicon();
    }, [])

    const extractCompanyNameAndFavicon = () => {
        const website = searchParams?.get('website'); // Use optional chaining
        console.log('Extracted from URL - website:', website);

        if (website) {
            try {
                const url = new URL(website);
                const domain = url.hostname.split('.');
                const name = domain[domain.length - 2].charAt(0).toUpperCase() + domain[domain.length - 2].slice(1);
                console.log('Setting company name:', name);
                setCompanyName(name);
            } catch (error) {
                console.error('Error parsing website URL:', error);
            }
        } else {
            console.warn('No website parameter found in searchParams');
        }
    }

    const handleSendMessage = async (message: string) => {
        setMessages(prev => [...prev, { sender: 'You', content: message }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { sender: 'AI', content: data.response }]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { sender: 'AI', content: 'An error occurred. Please try again.' }]);
        }
    }

    return (
        <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            companyName={companyName}
        />
    );
}

// Parent component to wrap Chat in Suspense
const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Chat />
        </Suspense>
    );
};

export default Page;