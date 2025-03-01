import { BASE_API } from '../constants'

export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${BASE_API}/game/start`)
    const responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.error('Error fetching questions:', error)
    return []
  }
}
