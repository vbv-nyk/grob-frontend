import { useState } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import useGame from 'hooks/useGame'
import QuizFeedback from 'components/QuizFeedback'

const Game = () => {
  const { question, options, score, handleAnswer, nextQuestion, isGameOver } =
    useGame()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [funFact, setFunFact] = useState<string | null>(null)

  if (!question)
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl">
        Loading...
      </div>
    )
  if (isGameOver) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
        <motion.h1 className="text-5xl font-extrabold" animate={{ scale: 1.1 }}>
          Game Over!
        </motion.h1>
        <p className="mt-4 text-2xl">Your Final Score: {score} / 10</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg hover:bg-yellow-500"
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

  const getButtonStyle = (option: string) => {
    if (!selectedOption) return 'bg-blue-600 hover:bg-blue-700'
    if (option === question.city) return 'bg-green-600'
    if (option === selectedOption) return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <motion.div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      {showConfetti && <Confetti />}
      <motion.h1
        className="mb-4 text-4xl font-extrabold text-gray-800"
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -20, opacity: 0 }}
      >
        Guess the City
      </motion.h1>
      <motion.p
        className="mb-4 text-xl text-gray-700"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        Clue: {question.clues[0]}
      </motion.p>
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
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
      </motion.div>
      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  )
}

export default Game
