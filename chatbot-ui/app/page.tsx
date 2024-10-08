'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputForm from '../components/InputForm'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (website: string) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website }),
      })
      const data = await response.json()
      console.log("Response from server:", data);  // Add this line for debugging
      if (data.success) {
        const faviconPath = data.faviconPath || '/favicon.ico'
        console.log("Using faviconPath:", faviconPath);  // Add this line for debugging
        router.push(`/chat?website=${encodeURIComponent(website)}&favicon=${encodeURIComponent(faviconPath)}`);
      } else {
        throw new Error(data.error || 'Failed to crawl website')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  )
}