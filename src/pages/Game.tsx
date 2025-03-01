import useGame from 'hooks/useGame'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'

const Game = () => {
  const { question, options, score, handleAnswer, nextQuestion, isGameOver } =
    useGame()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [funFact, setFunFact] = useState<string | null>(null)

  if (!question) return <div>Loading...</div>
  if (isGameOver) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-4xl font-bold">Game Over!</h1>
        <p className="mt-4 text-xl">Your Final Score: {score} / 10</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md transition hover:bg-blue-600"
        >
          Play Again
        </button>
      </div>
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

  const getButtonColor = (option: string) => {
    if (!selectedOption) return 'bg-blue-500 hover:bg-blue-600'
    if (option === question.city) return 'bg-green-800'
    if (option === selectedOption) return 'bg-red-600'
    return 'bg-gray-800'
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {showConfetti && <Confetti />}
      <motion.h1
        className="mb-4 text-3xl font-bold"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
      >
        Guess the City
      </motion.h1>
      <motion.p
        className="mb-2 text-lg"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        Clue: {question.clues[0]}
      </motion.p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelection(option)}
            className={`rounded-lg p-3 text-white shadow-md transition hover:scale-105 ${getButtonColor(
              option
            )}`}
            disabled={!!selectedOption}
            animate={{ scale: selectedOption ? 1.1 : 1 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {selectedOption && (
        <motion.div
          className="mt-4 text-xl"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <p className="font-bold">
            {selectedOption === question.city ? '🎉 Correct!' : '😢 Incorrect!'}
          </p>
          <p className="text-md mt-2 text-gray-700">Fun Fact: {funFact}</p>
          <button
            onClick={() => {
              setSelectedOption(null)
              setShowConfetti(false)
              setFunFact(null)
              nextQuestion()
            }}
            className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-white shadow-md transition hover:bg-green-600"
          >
            Next Question
          </button>
        </motion.div>
      )}
      <p className="mt-4 text-xl">Score: {score}</p>
    </div>
  )
}

export default Game
