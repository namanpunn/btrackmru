import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center mb-6">
        <svg
          className="w-16 h-16 text-yellow-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m2-4h.01M12 20.25c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9-4.968 0-9 4.03-9 9 0 4.97 4.032 9 9 9z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Page Under Development
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-6">
        We’re working hard to bring this page to life. Please check back soon!
      </p>

      {/* Home Button */}
      <Link href="/user">
        <div className="inline-block px-8 py-3 bg-yellow-300 text-white font-semibold rounded-md shadow hover:bg-yellow-300 transition duration-150">
          Go Back Home
        </div>
      </Link>
    </div>
  </main>
  )
}

export default page
