import { useState, useRef, useEffect } from 'react'
import { Box, VStack, HStack, Text, Input, Button, Flex } from '@chakra-ui/react'

export default function ChatInterface({ messages, onSendMessage }) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    // Remove the useEffect hook that was sending the initial greeting

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim()) {
            onSendMessage(input.trim())
            setInput('')
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <Box maxWidth="800px" margin="auto" mt={8}>
            <VStack spacing={4} align="stretch">
                <Box height="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={4}>
                    {messages.map((msg, index) => (
                        <HStack key={index} alignSelf={msg.sender === 'You' ? 'flex-end' : 'flex-start'} mb={2}>
                            <Text fontWeight="bold">{msg.sender}:</Text>
                            <Text>{msg.content}</Text>
                        </HStack>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
                <form onSubmit={handleSubmit}>
                    <Flex>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            mr={2}
                        />
                        <Button type="submit" colorScheme="blue">
                            Send
                        </Button>
                    </Flex>
                </form>
            </VStack>
        </Box>
    )
}