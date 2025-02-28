// src/hooks/useGame.ts
import { useEffect, useState } from 'react'

interface Destination {
  _id: string
  city: string
  country: string
  clues: string[]
  fun_fact: string[]
  trivia: string[]
}

const useGame = () => {
  const [questions, setQuestions] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/game/clue')
        if (!response.ok) throw new Error('Failed to fetch questions')
        const data = await response.json()
        setQuestions(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  return { questions, loading, error }
}

export default useGame
