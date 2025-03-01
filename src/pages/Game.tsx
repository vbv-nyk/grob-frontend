import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import useGame from 'hooks/useGame'
import QuizFeedback from 'components/QuizFeedback'
import EmojiRain from 'components/effects/EmojiRain'
import GameOver from 'components/GameOver'

const Game = () => {
  const challengeId = window.location.pathname.split('/')?.pop()
  const {
    question,
    options,
    score,
    handleAnswer,
    nextQuestion,
    isGameOver,
    restartGame,
    createChallenge,
    challengeUrl,
    challengerData,
    questions
  } = useGame(challengeId)

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [funFact, setFunFact] = useState<string | null>(null)

  // New state to manage the challenge welcome screen
  const [showChallengeWelcome, setShowChallengeWelcome] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Effect to show welcome screen when there's challenger data
  useEffect(() => {
    if (challengerData && !gameStarted && !isGameOver) {
      setShowChallengeWelcome(true)
    }
  }, [challengerData, gameStarted, isGameOver])

  const handleAcceptChallenge = () => {
    setShowChallengeWelcome(false)
    setGameStarted(true)
  }

  if (!question && !showChallengeWelcome)
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl">
        Loading...
      </div>
    )

  if (isGameOver) {
    return (
      <GameOver
        score={score}
        onRestart={restartGame}
        onCreateChallenge={createChallenge}
        challengeUrl={challengeUrl}
        challengerData={challengerData}
        userData={questions}
      />
    )
  }

  // Render challenge welcome screen
  if (showChallengeWelcome && challengerData) {
    const { username, score: challengerScore } = challengerData

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md rounded-xl bg-white/10 p-8 backdrop-blur-sm"
        >
          <h1 className="mb-6 text-center text-4xl font-extrabold">
            Challenge Accepted?
          </h1>

          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-yellow-400 text-3xl font-bold text-black">
              {challengerScore}/10
            </div>
            <p className="text-center text-2xl font-semibold">
              {username} has challenged you!
            </p>
            <p className="mt-3 text-center">
              Think you can beat their score in the City Knowledge Challenge?
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAcceptChallenge}
              className="rounded-lg bg-green-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-green-600"
            >
              Accept Challenge
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="rounded-lg bg-gray-200 py-3 text-gray-800 shadow-lg transition hover:bg-gray-300"
            >
              Start New Game
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const handleSelection = (option: string) => {
    setSelectedOption(option)
    const isCorrect = handleAnswer(option)
    setShowConfetti(isCorrect)
    setFunFact(
      question.fun_fact[Math.floor(Math.random() * question.fun_fact.length)]
    )
  }

  const getButtonStyle = (option: string) => {
    if (!selectedOption) return 'bg-blue-600 hover:bg-blue-700'
    if (option === question.city) return 'bg-green-600'
    if (option === selectedOption) return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <motion.div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      {showConfetti && <Confetti />}
      {selectedOption && !showConfetti && <EmojiRain />}
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: selectedOption ? 10 : 0 }}
      >
        <h1 className="mb-4 text-4xl font-extrabold text-gray-800">
          Guess the City
        </h1>
        <p className="mb-4 text-xl text-gray-700">Clue: {question.clues[0]}</p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelection(option)}
              className={`rounded-lg p-3 text-lg font-semibold text-white transition-transform hover:scale-105 ${getButtonStyle(
                option
              )}`}
              disabled={!!selectedOption}
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>
      {selectedOption && (
        <QuizFeedback
          funFact={funFact}
          nextQuestion={nextQuestion}
          question={question}
          selectedOption={selectedOption}
          setShowConfetti={setShowConfetti}
          setFunFact={setFunFact}
          setSelectedOption={setSelectedOption}
        />
      )}
    </motion.div>
  )
}

export default Game
