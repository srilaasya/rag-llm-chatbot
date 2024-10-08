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
        <div className="flex flex-col items-center w-full max-w-2xl">
            <h1 className="text-4xl font-light text-white text-center mb-8 font-montserrat">
                Chat with any company's brain – no boring FAQs needed!
            </h1>
            <div className="w-full bg-purple-900/10 rounded-lg shadow-lg overflow-hidden p-5 border border-gray-600/65 transform scale-90">
                <div className="flex justify-center m-6">
                    <div className="bg-transparent rounded-full p-2">
                        <Image src="/favicon.ico" alt="Logo" width={64} height={64} />
                    </div>
                </div>
                <h2 className="text-3xl font-medium text-white text-center mb-2">Enter a website URL</h2>
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
                            placeholder="https://www.exa.ai"
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
        </div>
    )
}