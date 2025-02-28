import { useState, useEffect } from 'react'

interface Question {
  city: string
  country: string
  clues: string[]
  fun_fact: string[]
  trivia: string[]
}

const useGame = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const questionResponse = await fetch('http://localhost:4000/game/start')
        const questionData: Question[] = await questionResponse.json()
        setQuestions(questionData)

        const citiesResponse = await fetch('http://localhost:4000/game/cities')
        const citiesData: string[] = await citiesResponse.json()
        setCities(citiesData)

        if (questionData.length > 0) {
          setOptions(generateOptions(questionData[0], citiesData))
        }
      } catch (error) {
        console.error('Error fetching game data:', error)
      }
    }
    fetchGameData()
  }, [])

  const generateOptions = (
    question: Question,
    allCities: string[]
  ): string[] => {
    const incorrectOptions = allCities
      .filter((city) => city !== question.city)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    return [...incorrectOptions, question.city].sort(() => 0.5 - Math.random())
  }

  const handleAnswer = (selected: string) => {
    const isCorrect = selected === questions[currentQuestionIndex].city
    if (isCorrect) setScore(score + 1)
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex)
        setOptions(generateOptions(questions[nextIndex], cities))
      }
    }, 1000)
  }

  return {
    question: questions[currentQuestionIndex],
    options,
    score,
    handleAnswer
  }
}

export default useGame
