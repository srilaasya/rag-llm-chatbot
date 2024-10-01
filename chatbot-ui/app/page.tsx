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
      console.log('Sending crawl request for:', website);
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website }),
      })
      const data = await response.json();
      console.log('Crawl response:', data);
      if (data.success) {
        console.log('Crawl successful, navigating to /chat');
        router.push('/chat');
      } else {
        console.log('Crawl failed:', data.error);
        throw new Error(data.error || 'Failed to crawl website')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </>
  )
}