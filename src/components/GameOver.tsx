import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { ChallengerData, Question } from 'hooks/useGame'
import ResultsComparison from './GameComparison'

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
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [shareImage, setShareImage] = useState<string | null>(null)

  const shareCardRef = useRef<HTMLDivElement>(null)

  const handleCreateChallenge = async () => {
    if (!username) {
      setError('Please enter a unique name.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onCreateChallenge(username)
    } catch (err) {
      setError('Failed to create challenge. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateShareImage = async () => {
    if (shareCardRef.current) {
      try {
        // Make sure the card is visible and fully rendered before capture
        shareCardRef.current.style.display = 'flex'

        const dataUrl = await toPng(shareCardRef.current, {
          quality: 1,
          backgroundColor: '#4c1d95'
        })

        // Hide the card again after capture
        shareCardRef.current.style.display = 'none'

        setShareImage(dataUrl)
        setShowSharePopup(true)
      } catch (err) {
        console.error('Error generating image:', err)
      }
    }
  }

  const shareToWhatsApp = () => {
    if (challengeUrl) {
      const shareText = `I scored ${score}/10 in the City Knowledge Challenge! Can you beat me? Play here: ${challengeUrl}`
      const encodedText = encodeURIComponent(shareText)
      const whatsappUrl = `https://wa.me/?text=${encodedText}`
      window.open(whatsappUrl, '_blank')
    }
  }

  useEffect(() => {
    // If challenge URL becomes available and we have a username, prepare the share image
    if (challengeUrl && username) {
      // Short timeout to ensure DOM is ready
      setTimeout(() => {
        generateShareImage()
      }, 100)
    }
  }, [challengeUrl, username])

  return (
    <>
      <ResultsComparison challengerData={challengerData} userData={userData} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
        <motion.h1
          className="text-5xl font-extrabold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          Game Over!
        </motion.h1>
        <p className="mt-4 text-2xl">Your Final Score: {score} / 10</p>

        {!challengeUrl ? (
          <>
            <div className="mt-6 w-full max-w-md">
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-md p-3 text-black shadow-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {error && <p className="mt-2 text-red-400">{error}</p>}
            </div>

            <button
              onClick={handleCreateChallenge}
              className="mt-4 rounded-lg bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg transition hover:scale-105 hover:bg-yellow-500"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Challenge a Friend'}
            </button>
          </>
        ) : (
          <button
            onClick={() => generateShareImage()}
            className="mt-6 flex items-center rounded-lg bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-green-600"
          >
            <svg
              className="mr-2 size-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Challenge a Friend
          </button>
        )}

        <button
          onClick={onRestart}
          className="mt-6 rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-blue-600"
        >
          Play Again
        </button>

        {/* Share card template - initially hidden */}
        <div
          ref={shareCardRef}
          style={{ display: 'none' }}
          className="flex h-64 w-full flex-col items-center justify-center rounded-lg bg-indigo-800 p-6"
        >
          <h2 className="mb-3 text-2xl font-bold text-white">City Challenge</h2>

          <div className="mb-4 flex flex-col items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-black">
              {score}/10
            </div>
            <p className="mt-3 text-xl font-semibold text-white">
              {username}&apos;s Challenge
            </p>
          </div>

          <p className="text-center text-lg text-white">
            Can you beat this score?
          </p>
        </div>

        {/* Share Popup */}
        {showSharePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-4 text-2xl font-bold text-gray-800">
                Challenge a Friend
              </h3>

              <div className="mb-4 flex justify-center">
                {shareImage && (
                  <div className="relative">
                    <img
                      src={shareImage}
                      alt="Challenge Card"
                      className="max-w-full rounded-lg shadow-md"
                    />
                    <div className="absolute bottom-2 right-2 rounded bg-white/80 px-2 py-1 text-xs">
                      Your challenge card
                    </div>
                  </div>
                )}
              </div>

              {challengeUrl && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-600">Challenge link:</p>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={challengeUrl}
                      className="flex-1 rounded-l-md border border-gray-300 bg-gray-100 p-2 text-sm text-black"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(challengeUrl)
                        alert('Link copied to clipboard!')
                      }}
                      className="rounded-r-md bg-blue-500 p-2 text-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600"
                >
                  <svg
                    className="mr-2 size-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </button>

                <button
                  onClick={() => setShowSharePopup(false)}
                  className="rounded-lg bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default GameOver
