'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ChatInterface from '../../components/ChatInterface'

interface Message {
    sender: string;
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [companyName, setCompanyName] = useState<string>('')
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        console.log('Chat page mounted');
        extractCompanyNameAndFavicon();
    }, [])

    useEffect(() => {
        if (companyName) {
            fetchInitialGreeting();
        }
    }, [companyName])

    const extractCompanyNameAndFavicon = () => {
        const website = searchParams.get('website')
        console.log('Extracted from URL - website:', website);

        if (website) {
            try {
                const url = new URL(website)
                const domain = url.hostname.split('.')
                const name = domain[domain.length - 2].charAt(0).toUpperCase() + domain[domain.length - 2].slice(1)
                console.log('Setting company name:', name);
                setCompanyName(name)
            } catch (error) {
                console.error('Error parsing website URL:', error)
                setCompanyName('AI')
            }
        } else {
            setCompanyName('AI')
        }
    }

    const fetchInitialGreeting = async () => {
        try {
            console.log('Fetching initial greeting for company:', companyName);
            const response = await fetch(`/api/initial_greeting?companyName=${encodeURIComponent(companyName)}`);
            const data = await response.json();
            if (response.ok) {
                setMessages([{ sender: 'AI', content: data.response }]);
            } else {
                console.error('Error fetching initial greeting:', data.error);
            }
        } catch (error) {
            console.error('Error fetching initial greeting:', error);
        }
    }

    const handleSendMessage = async (message: string) => {
        setMessages(prev => [...prev, { sender: 'You', content: message }])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            const data = await response.json()
            if (response.ok) {
                setMessages(prev => [...prev, { sender: 'AI', content: data.response }])
            } else {
                throw new Error(data.error || 'Failed to get response')
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setMessages(prev => [...prev, { sender: 'AI', content: 'An error occurred. Please try again.' }])
        }
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                companyName={companyName}
            />
        </Suspense>
    )
}