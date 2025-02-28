export const fetchQuestions = async () => {
  try {
    const response = await fetch(`http://localhost:4000/game/start`)
    const responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.error('Error fetching questions:', error)
    return []
  }
}
