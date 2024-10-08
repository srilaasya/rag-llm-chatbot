import { useState } from 'react'
import Image from 'next/image'

export default function InputForm({ onSubmit, isLoading }) {
    const [website, setWebsite] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (website.trim()) {
            onSubmit(website)
        }
    }

    return (
        <div className="w-full max-w-2xl bg-black/200 rounded-lg shadow-lg overflow-hidden p-6 border border-gray-800/65">
            <div className="flex justify-center mb-6">
                <div className="bg-black rounded-full p-2">
                    <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">Enter a website URL</h1>
            <p className="text-gray-500 text-center mb-8">I'll gather information about the company for you.</p>

            {isLoading ? (
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-white">Getting all the information...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 px-6 rounded-full hover:bg-purple-700 transition-colors"
                        disabled={!website.trim()}
                    >
                        Start Research
                    </button>
                </form>
            )}
        </div>
    )
}