import useGame from 'hooks/useGame'

const Game = () => {
  const { question, options, score, handleAnswer } = useGame()

  if (!question) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-3xl font-bold">Guess the City</h1>
      <p className="mb-2 text-lg">Clue: {question.clues[0]}</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="rounded-lg bg-blue-500 p-3 text-white shadow-md transition hover:bg-blue-600"
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xl">Score: {score}</p>
    </div>
  )
}

export default Game
