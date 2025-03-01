import { fetchQuestions } from 'api/gameApi'
import { useState, useEffect, useCallback } from 'react'

export interface Question {
  id: string // ID of the city object (used for backend verification)
  question: string // Generic question (e.g., "Which city is shown in the image?")
  image: string // URL of the city image
  options: string[] // 4 shuffled answer choices (1 correct, 3 incorrect)
  funFact: string // A fun fact about the city
  clue: string // A hint for the player
  correct: boolean
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
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null)
  const [challengerData, setChallengerData] = useState<ChallengerData | null>(
    null
  )

  const loadQuestions = useCallback(async () => {
    const data = await fetchQuestions()
    setQuestions(data)
    console.log(data)
    setOptions(data[0].options)
  }, [])

  const loadChallengeData = useCallback(async (challengeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/challenge/${challengeId}`
      )
      const data = await response.json()
      setQuestions(data.questions)
    } catch (error) {
      console.error('Failed to load challenge data:', error)
    }
  }, [])
  useEffect(() => {
    if (challengeId) {
      loadChallengeData(challengeId)
    } else {
      loadQuestions()
    }
  }, [challengeId, loadChallengeData, loadQuestions])

  const handleAnswer = async (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex] // Get current question

    try {
      const response = await fetch('http://localhost:4000/game/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id, // Send question ID
          selectedCity: selectedOption // Send selected answer
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error verifying answer:', data.error)
        return false
      }

      const tempIsCorrect = data.correct // Get result from backend

      // Update question state
      const modifiedQuestions = [...questions]
      modifiedQuestions[currentQuestionIndex].correct = tempIsCorrect
      setQuestions(modifiedQuestions)

      // Update score counters
      if (tempIsCorrect) {
        setScore((prevScore) => prevScore + 1)
        setCorrectCount((prevCount) => prevCount + 1)
      } else {
        setIncorrectCount((prevCount) => prevCount + 1)
      }

      setIsCorrect(tempIsCorrect)
      return tempIsCorrect
    } catch (error) {
      console.error('Failed to submit answer:', error)
      return false
    }
  }

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < 10 && nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
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
            questionId: q.id,
            correct: q.correct || false
          })),
          score
        })
      })

      const data = await response.json()

      if (response.ok) {
        setChallengeUrl(
          `${window.location.origin}/challenge/${data.challengeId}`.trim()
        )
      } else {
        // Handle case where username is already taken
        if (data.error === 'Username already taken') {
          alert(
            'This username is already taken. Please choose a different one.'
          )
        } else {
          console.error('Error creating challenge:', data.error)
        }
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
    questions,
    correctCount,
    incorrectCount,
    isCorrect
  }
}

export default useGame
