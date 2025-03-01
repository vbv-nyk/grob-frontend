import useGame from 'hooks/useGame'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import QuizFeedback from 'components/QuizFeedback'

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
    return 'bg-gray-700'
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
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
      {/* <p className="mt-4 text-xl">Score: {score} / 10</p> */}
      <div className="flex items-center justify-around">
        {showConfetti && <Confetti />}
        <AnimatePresence mode="wait">
          <motion.div
            className={`mt-4 grid grid-cols-2 ${
              selectedOption && 'flex-col'
            }  justify-center gap-4`}
            initial={{ x: -0 }}
            animate={{
              scale: selectedOption ? 1 : 1.1,
              x: selectedOption ? -20 : 0
            }}
            transition={{ duration: 0.5 }}
          >
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelection(option)}
                className={`rounded-lg p-3 text-white shadow-md transition hover:scale-105 ${getButtonColor(
                  option
                )}`}
                disabled={!!selectedOption}
              >
                {option}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
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
      </div>
    </div>
  )
}

export default Game
