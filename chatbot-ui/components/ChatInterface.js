import { useState, useRef, useEffect } from 'react'
import { Box, VStack, HStack, Text, Input, Button, Flex, Container, Heading } from '@chakra-ui/react'

export default function ChatInterface({ messages, onSendMessage, companyName }) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim()) {
            onSendMessage(input.trim())
            setInput('')
        }
    }

    const endSession = async () => {
        try {
            await fetch('/api/end_session', { method: 'POST' });
            console.log('Session ended successfully');
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

        // Call endSession when component unmounts
        return () => {
            endSession();
        };
    }, [messages])

    return (
        <Container maxW="container.md" centerContent>
            <Box width="100%" maxWidth="800px" margin="auto" mt={8}>
                <Heading as="h1" size="xl" textAlign="center" mb={6}>
                    {companyName}'s Assistant
                </Heading>
                <VStack spacing={4} align="stretch">
                    <Box height={{ base: "300px", md: "400px" }} overflowY="auto" borderWidth={1} borderRadius="md" p={4}>
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
        </Container>
    )
}