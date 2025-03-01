import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChallengerData, Question } from 'hooks/useGame'

interface GameOverProps {
  score: number
  challengerData: ChallengerData | null
  userData: Question[]
  onRestart: () => void
  onCreateChallenge: (username: string) => Promise<void>
  challengeUrl: string | null
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  onRestart,
  onCreateChallenge,
  challengeUrl,
  challengerData,
  userData
}) => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateChallenge = async () => {
    if (!username) {
      setError('Please enter a unique name.')
      return
    }

    setLoading(true)
    setError('')

    await onCreateChallenge(username)
    setLoading(false)
  }
  console.log(userData, challengerData)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
      <motion.h1
        className="text-5xl font-extrabold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Game Over!
      </motion.h1>
      <p className="mt-4 text-2xl">Your Final Score: {score} / 10</p>

      <input
        type="text"
        placeholder="Enter your name"
        className="mt-4 rounded-md p-2 text-black"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {error && <p className="mt-2 text-red-400">{error}</p>}

      {challengeUrl ? (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-lg">Share this link:</p>
          <a
            href={challengeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 break-all rounded-lg bg-green-500 px-4 py-2 text-white"
          >
            {challengeUrl}
          </a>
        </div>
      ) : (
        <button
          onClick={handleCreateChallenge}
          className="mt-4 rounded-lg bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg transition hover:bg-yellow-500"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Challenge'}
        </button>
      )}

      <button
        onClick={onRestart}
        className="mt-6 rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-blue-600"
      >
        Play Again
      </button>
    </div>
  )
}

export default GameOver
