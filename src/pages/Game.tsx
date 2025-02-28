import useGame from 'hooks/useGame'
import { useState } from 'react'
import Confetti from 'react-confetti'

const Game = () => {
  const { question, options, score, handleAnswer, nextQuestion } = useGame()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [funFact, setFunFact] = useState<string | null>(null)

  if (!question) return <div>Loading...</div>

  const handleSelection = (option: string) => {
    const isCorrect = handleAnswer(option)
    setFeedback(isCorrect ? '🎉 Correct!' : '😢 Incorrect!')
    setShowConfetti(isCorrect)
    setFunFact(
      question.fun_fact[Math.floor(Math.random() * question.fun_fact.length)]
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {showConfetti && <Confetti />}
      <h1 className="mb-4 text-3xl font-bold">Guess the City</h1>
      <p className="mb-2 text-lg">Clue: {question.clues[0]}</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleSelection(option)}
            className="rounded-lg bg-blue-500 p-3 text-white shadow-md transition hover:bg-blue-600"
            disabled={feedback !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div className="mt-4 text-xl">
          <p>{feedback}</p>
          <p className="text-md mt-2 text-gray-700">Fun Fact: {funFact}</p>
          <button
            onClick={() => {
              setFeedback(null)
              setShowConfetti(false)
              setFunFact(null)
              nextQuestion()
            }}
            className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-white shadow-md transition hover:bg-green-600"
          >
            Next Question
          </button>
        </div>
      )}
      <p className="mt-4 text-xl">Score: {score}</p>
    </div>
  )
}

export default Game
