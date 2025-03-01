import { motion, AnimatePresence } from 'framer-motion'

type QuizFeedbackProps = {
  isCorrect: boolean
  funFact: string | null
  nextQuestion: () => void
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>
  setFunFact: React.Dispatch<React.SetStateAction<string | null>>
}

export default function QuizFeedback({
  isCorrect,
  funFact,
  nextQuestion,
  setSelectedOption,
  setFunFact
}: QuizFeedbackProps) {
  const handleNext = () => {
    // Animate out fun fact before switching to the next question
    setSelectedOption(null)
    setFunFact(null)
    nextQuestion()
  }

  return (
    <motion.div
      className="mt-6 min-w-[300px] max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <p
        className={`text-xl font-bold ${
          isCorrect ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isCorrect ? '🎉 Correct!' : '😢 Incorrect!'}
      </p>

      {/* Animated fun fact */}
      <AnimatePresence>
        {funFact && (
          <motion.p
            className="mt-2 text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Fun Fact: {funFact}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={handleNext}
        className="mt-4 w-full rounded-lg bg-green-500 px-4 py-2 text-white shadow-md transition hover:bg-green-600 focus:ring-4 focus:ring-green-300"
      >
        Next Question
      </button>
    </motion.div>
  )
}
