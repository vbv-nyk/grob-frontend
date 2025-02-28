// src/pages/Game.tsx
import { useState } from 'react'
import useGame from '../hooks/useGame'

const Game = () => {
  const { questions, loading, error } = useGame()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  if (loading) return <p>Loading questions...</p>
  if (error) return <p>Error: {error}</p>
  if (questions.length === 0) return <p>No questions available.</p>

  const currentQuestion = questions[currentIndex]
  const possibleAnswers = [
    currentQuestion.city,
    ...questions
      .filter((q) => q.city !== currentQuestion.city)
      .map((q) => q.city)
      .slice(0, 3)
  ].sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === currentQuestion.city) {
      setScore(score + 1)
      setFeedback('🎉 Correct! ' + currentQuestion.fun_fact[0])
    } else {
      setFeedback('😢 Incorrect! ' + currentQuestion.fun_fact[0])
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
        setFeedback(null)
      } else {
        alert(`Game Over! Final Score: ${score}`)
      }
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">Globetrotter Challenge</h1>
      <p className="mb-2">Clue: {currentQuestion.clues[0]}</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {possibleAnswers.map((answer) => (
          <button
            key={answer}
            onClick={() => handleAnswer(answer)}
            className={`rounded-lg p-3 text-lg text-white shadow-md transition-all ${
              selectedAnswer === answer
                ? answer === currentQuestion.city
                  ? 'bg-green-500'
                  : 'bg-red-500'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {answer}
          </button>
        ))}
      </div>
      {feedback && <p className="mt-4 text-lg font-semibold">{feedback}</p>}
      <p className="mt-4 font-bold">Score: {score}</p>
    </div>
  )
}

export default Game
