'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatInterface from '../../components/ChatInterface'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [companyName, setCompanyName] = useState('')
    const searchParams = useSearchParams()

    useEffect(() => {
        console.log('Chat page mounted');
        fetchInitialGreeting();
        extractCompanyName();
    }, [])

    const extractCompanyName = () => {
        const website = searchParams.get('website')
        if (website) {
            const url = new URL(website)
            const domain = url.hostname.split('.')
            setCompanyName(domain[domain.length - 2].charAt(0).toUpperCase() + domain[domain.length - 2].slice(1))
        } else {
            setCompanyName('AI')
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

    const handleSendMessage = async (message) => {
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

    return <ChatInterface messages={messages} onSendMessage={handleSendMessage} companyName={companyName} />
}