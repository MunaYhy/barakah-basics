export const QUESTIONS: string[] = [
  "What is one thing you did for yourself today?",
  "What are you grateful for right now?",
  "What made you smile today?",
  "What does your body need most right now?",
  "What is one small win you had today?",
  "What would make tomorrow feel lighter?",
  "What is something you want to remember about today?",
  "How are you feeling in one word?",
  "What helped you get through today?",
  "What do you need more of this week?",
  "What do you need less of this week?",
  "What is one thing you are proud of today?",
  "What moment with your baby will you remember?",
  "Who or what supported you today?",
  "What is one thing you'd tell yourself from a month ago?",
  "What does 'rest' look like for you today?",
  "What is something you are learning about yourself?",
  "What is bringing you joy right now?",
  "What do you wish someone would say to you?",
  "How did you show yourself compassion today?",
  "What feels hard right now? You don't have to fix it, just name it.",
  "What is one thing you are looking forward to?",
  "What made this day unique?",
  "If your body could speak, what would it say?",
  "What is one thing you did today that took courage?",
  "What is something beautiful you noticed today?",
  "What would you tell a friend who was going through what you are going through?",
  "What habit felt easiest today?",
  "What is one thing you want to let go of?",
  "What does your heart need to hear right now?",
]

export function getTodayQuestion(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return QUESTIONS[dayOfYear % QUESTIONS.length]
}
