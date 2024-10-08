import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const ChatInterface = ({ messages, onSendMessage, companyName }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    // const [faviconError, setFaviconError] = useState(false);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4"> {/* Added pb-20 for footer space */}
            <div className="w-full max-w-2xl bg-[#1e1e1e]/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-600/20 flex flex-col h-[200vh] max-h-[800px]"> {/* Adjusted height */}
                <div className="flex justify-center p-4 bg-transparent">
                    <div className="bg-transparent rounded-full p-2">
                        <Image
                            src='/favicon.ico'
                            alt={`${companyName} Logo`}
                            width={64}
                            height={64}
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`px-4 py-2 max-w-[70%] ${message.sender === 'You'
                                ? 'bg-purple-600 text-white rounded-lg'
                                : 'bg-white-200 text-white rounded-lg border border-gray-600/20'}`}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-transparent">
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center bg-gray-900 rounded-full p-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-grow px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-purple-700 transition-colors flex-shrink-0"
                                disabled={!input.trim()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;