import { ChakraProvider, Box } from '@chakra-ui/react'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            justifyContent="center"
            alignItems="center"
            bg="gray.50"
          >
            {children}
          </Box>
        </ChakraProvider>
      </body>
    </html>
  )
}