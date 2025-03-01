import React from 'react'
import { motion } from 'framer-motion'
import { ChallengerData, Question } from 'hooks/useGame'

const ResultsComparison = ({
  userData,
  challengerData
}: {
  challengerData: ChallengerData | null
  userData: Question[]
}) => {
  if (!challengerData) return <></>
  // Calculate user score
  const userScore = userData.filter((item) => item.correct).length

  // Helper to get challenger's answer for a question
  const getChallengerAnswer = (questionId: string) => {
    const challenge = challengerData?.challenges.find(
      (c) => c._id === questionId
    )
    return challenge ? challenge.correct : false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold">Challenge Results</h1>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-blue-400">
                <span className="text-2xl font-bold">You</span>
              </div>
              <div className="text-xl font-semibold">{userScore}/10</div>
            </div>

            <div className="text-3xl font-bold">VS</div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-pink-400">
                <span className="text-2xl font-bold">
                  {challengerData.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-xl font-semibold">
                {challengerData.score}/10
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {userData.map((question, index) => {
            const challengerCorrect = getChallengerAnswer(question._id)
            return (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="overflow-hidden rounded-xl bg-white/10 shadow-lg backdrop-blur-md"
              >
                <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 p-4">
                  <h3 className="text-xl font-bold">Question {index + 1}</h3>
                  <p className="text-lg">
                    {question.city}, {question.country}
                  </p>
                </div>

                <div className="grid h-24 grid-cols-2">
                  {/* Your Answer */}
                  <div
                    className={`flex items-center justify-center ${
                      question.correct ? 'bg-green-500/70' : 'bg-red-500/70'
                    } p-4`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">Your Answer</span>
                      <div className="mt-2 flex items-center">
                        {question.correct ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Challenger's Answer */}
                  <div
                    className={`flex items-center justify-center ${
                      challengerCorrect ? 'bg-green-500/70' : 'bg-red-500/70'
                    } p-4`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">
                        {challengerData.username}&apos;s Answer
                      </span>
                      <div className="mt-2 flex items-center">
                        {challengerCorrect ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ResultsComparison
