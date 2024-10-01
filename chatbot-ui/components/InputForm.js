import { useState } from 'react'
import { Box, Input, Button, VStack, Heading } from '@chakra-ui/react'

export default function InputForm({ onSubmit, isLoading }) {
    const [website, setWebsite] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(website)
    }

    return (
        <Box maxWidth="500px" margin="auto" mt={8}>
            <VStack spacing={4}>
                <Heading>Enter Company Website</Heading>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack spacing={4}>
                        <Input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://example.com"
                            required
                        />
                        <Button type="submit" colorScheme="blue" isLoading={isLoading} width="100%">
                            Start Crawling
                        </Button>
                    </VStack>
                </form>
            </VStack>
        </Box>
    )
}