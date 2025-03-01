import { useState } from 'react'
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

  if (!question)
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
