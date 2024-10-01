'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '../../components/ChatInterface'

export default function Chat() {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        console.log('Chat page mounted');
        fetchInitialGreeting();
    }, [])

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

    return <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
}