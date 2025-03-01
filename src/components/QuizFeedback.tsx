import { motion } from 'framer-motion'

type QuizFeedbackProps = {
  selectedOption: string | null
  question: { city: string }
  funFact: string | null
  nextQuestion: () => void
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>
  setFunFact: React.Dispatch<React.SetStateAction<string | null>>
}

export default function QuizFeedback({
  selectedOption,
  question,
  funFact,
  nextQuestion,
  setShowConfetti,
  setSelectedOption,
  setFunFact
}: QuizFeedbackProps) {
  return (
    selectedOption && (
      <motion.div
        className="mt-6 min-w-[300px] max-w-md flex-[0.8] rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <p
          className={`text-xl font-bold ${
            selectedOption === question.city ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {selectedOption === question.city ? '🎉 Correct!' : '😢 Incorrect!'}
        </p>
        <p className="mt-2 text-gray-700">Fun Fact: {funFact}</p>
        <button
          onClick={() => {
            setShowConfetti(false)
            nextQuestion()
            setSelectedOption(null)
            setFunFact(null)
            nextQuestion()
          }}
          className="mt-4 w-full rounded-lg bg-green-500 px-4 py-2 text-white shadow-md transition hover:bg-green-600 focus:ring-4 focus:ring-green-300"
        >
          Next Question
        </button>
      </motion.div>
    )
  )
}
