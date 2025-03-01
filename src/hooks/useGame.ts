import { fetchQuestions } from 'api/gameApi'
import { useState, useEffect } from 'react'

export interface Question {
  city: string
  country: string
  clues: string[]
  fun_fact: string[]
  _id: string
  correct: boolean | null
}

type ChallengeData = {
  _id: string
  correct: boolean
}

export type ChallengerData = {
  username: string
  score: number
  challenges: ChallengeData[]
}

const useGame = (challengeId?: string) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null)
  const [challengerData, setChallengerData] = useState<ChallengerData | null>(
    null
  )

  useEffect(() => {
    if (challengeId) {
      loadChallengeData(challengeId)
    } else {
      loadQuestions()
    }
  }, [challengeId])

  const loadQuestions = async () => {
    const data = await fetchQuestions()
    setQuestions(data)
    setOptions(generateOptions(data[0], data))
  }

  const loadChallengeData = async (challengeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/challenge/${challengeId}`
      )
      const data = await response.json()
      if (response.ok) {
        setQuestions(data.questions)
        setChallengerData({
          username: data.challenger.username,
          score: data.challenger.score,
          challenges: data.questions.map(
            (q: { _id: string; correct: boolean }) => ({
              _id: q._id,
              correct: q.correct
            })
          )
        })
        setOptions(generateOptions(data.questions[0], data.questions))
      }
    } catch (error) {
      console.error('Failed to load challenge data:', error)
    }
  }

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
    const modifiedQuestions = [...questions]
    modifiedQuestions[currentQuestionIndex].correct = isCorrect
    setQuestions(modifiedQuestions)
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

  const restartGame = () => {
    setScore(0)
    setCurrentQuestionIndex(0)
    setIsGameOver(false)
    setChallengeUrl(null)
    setChallengerData(null)
    loadQuestions()
  }

  const createChallenge = async (username: string) => {
    if (!username) return

    console.log(questions)
    try {
      const response = await fetch('http://localhost:4000/challenge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          questions: questions.map((q) => ({
            questionId: q._id,
            correct: q.correct || false
          })),
          score
        })
      })

      const data = await response.json()
      if (response.ok) {
        setChallengeUrl(`
          ${window.location.origin} / challenge / ${data.challengeId}
        `)
      }
    } catch (error) {
      console.error('Failed to create challenge:', error)
    }
  }

  return {
    question: questions[currentQuestionIndex],
    options,
    score,
    handleAnswer,
    nextQuestion,
    isGameOver,
    restartGame,
    challengeUrl,
    challengerData,
    createChallenge,
    questions
  }
}

export default useGame
