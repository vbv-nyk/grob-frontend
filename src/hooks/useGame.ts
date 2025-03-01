import { fetchQuestions } from 'api/gameApi'
import { useState, useEffect, useCallback } from 'react'

export interface Question {
  id: string // ID of the city object (used for backend verification)
  options: string[] // 4 shuffled answer choices (1 correct, 3 incorrect)
  funFact: string // A fun fact about the city
  clue: string // A hint for the player
  correct: boolean
  city: string | null
}

export type ChallengerData = {
  challenger: {
    username: string
    score: number
  }
  questions: Question[]
}

const useGame = (challengeId?: string) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null)
  const [correctCity, setCorrectCity] = useState(null)
  const [challengerData, setChallengerData] = useState<ChallengerData | null>(
    null
  )

  const loadQuestions = useCallback(async () => {
    const data = await fetchQuestions()
    setQuestions(data)
    console.log(data)
  }, [])

  const loadChallengeData = useCallback(async (challengeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/challenge/${challengeId}`
      )
      const data: ChallengerData = await response.json()
      const copiesData: ChallengerData = {
        ...data,
        questions: [...data.questions]
      }
      setChallengerData(copiesData)
      setQuestions([...data.questions])
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

      setQuestions((prevQuestions) =>
        prevQuestions.map((q, index) =>
          index === currentQuestionIndex
            ? { ...q, correct: tempIsCorrect, city: data.correctCity }
            : q
        )
      )

      // Update score counters
      if (tempIsCorrect) {
        setScore((prevScore) => prevScore + 1)
        setCorrectCount((prevCount) => prevCount + 1)
      } else {
        setIncorrectCount((prevCount) => prevCount + 1)
      }

      setCorrectCity(data.correctCity)
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
          questions: questions,
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
    score,
    handleAnswer,
    nextQuestion,
    isGameOver,
    restartGame,
    challengeUrl,
    correctCity,
    challengerData,
    createChallenge,
    questions,
    correctCount,
    incorrectCount,
    isCorrect
  }
}

export default useGame
