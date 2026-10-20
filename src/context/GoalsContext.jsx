/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const GoalsContext = createContext(null)
const STORAGE_KEY = 'ai-study-planner-goals'

function loadGoals() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState(loadGoals)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
    } catch {
      // The app remains usable if browser storage is unavailable.
    }
  }, [goals])

  function addGoal(goal) {
    setGoals(current => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: goal.title.trim(),
        description: goal.description.trim(),
        targetDate: goal.targetDate,
        targetHours: Number(goal.targetHours),
        completed: false
      }
    ])
  }

  function toggleGoal(id) {
    setGoals(current =>
      current.map(goal =>
        goal.id === id
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    )
  }

  function editGoal(id, updates) {
    setGoals(current =>
      current.map(goal =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
              title: updates.title.trim(),
              description: updates.description.trim(),
              targetHours: Number(updates.targetHours)
            }
          : goal
      )
    )
  }

  function deleteGoal(id) {
    setGoals(current => current.filter(goal => goal.id !== id))
  }

  function clearGoals() {
    if (window.confirm('Delete all saved goals?')) {
      setGoals([])
    }
  }

  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        toggleGoal,
        editGoal,
        deleteGoal,
        clearGoals
      }}
    >
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const context = useContext(GoalsContext)

  if (!context) {
    throw new Error('useGoals must be used inside GoalsProvider')
  }

  return context
}