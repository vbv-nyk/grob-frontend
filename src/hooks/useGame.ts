import { fetchQuestions } from 'api/gameApi'
import { useState, useEffect } from 'react'

interface Question {
  city: string
  country: string
  clues: string[]
  fun_fact: string[]
}

const useGame = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions()
      setQuestions(data)
      setOptions(generateOptions(data[0], data))
    }
    loadQuestions()
  }, [])

  const generateOptions = (question: Question, allQuestions: Question[]) => {
    const incorrectOptions = allQuestions
      .map((q) => q.city)
      .filter((city) => city !== question.city)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    return [question.city, ...incorrectOptions].sort(() => Math.random() - 0.5)
  }

  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].city
    if (isCorrect) setScore((prevScore) => prevScore + 1)
    return isCorrect
  }

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < 10 && nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setOptions(generateOptions(questions[nextIndex], questions))
    } else {
      setIsGameOver(true)
    }
  }

  return {
    question: questions[currentQuestionIndex],
    options,
    score,
    handleAnswer,
    nextQuestion,
    isGameOver
  }
}

export default useGame
