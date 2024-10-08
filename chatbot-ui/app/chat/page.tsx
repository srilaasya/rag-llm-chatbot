'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatInterface from '../../components/ChatInterface'

interface Message {
    sender: string;
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [companyName, setCompanyName] = useState<string>('')
    const [faviconPath, setFaviconPath] = useState<string>('/favicon.ico')
    const searchParams = useSearchParams()

    useEffect(() => {
        console.log('Chat page mounted');
        fetchInitialGreeting();
        extractCompanyNameAndFavicon();
    }, [])

    const extractCompanyNameAndFavicon = () => {
        const website = searchParams?.get('website')
        const favicon = searchParams?.get('favicon')
        console.log("Extracted favicon:", favicon);  // Add this line for debugging
        if (website) {
            const url = new URL(website)
            const domain = url.hostname.split('.')
            setCompanyName(domain[domain.length - 2].charAt(0).toUpperCase() + domain[domain.length - 2].slice(1))
        } else {
            setCompanyName('AI')
        }
        if (favicon) {
            setFaviconPath(decodeURIComponent(favicon))
        }
    }

    const fetchInitialGreeting = async () => {
        try {
            const response = await fetch('/api/initial_greeting');
            const data = await response.json();
            if (response.ok) {
                setMessages([{ sender: 'AI', content: data.response }]);
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

    return <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        companyName={companyName}
        faviconPath={faviconPath}
    />
}