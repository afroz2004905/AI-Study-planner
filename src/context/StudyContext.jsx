/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const StudyContext = createContext(null)
const STORAGE_KEY = 'ai-study-planner-plan'

function loadPlan() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-')
}

function displayDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function StudyProvider({ children }) {
  const [plan, setPlan] = useState(loadPlan)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    } catch {
      console.error('Your plan could not be saved in this browser.')
    }
  }, [plan])

  function generatePlan(subjects, examDate, hours) {
    setError('')

    const subjectList = [
      ...new Set(
        subjects
          .split(',')
          .map(subject => subject.trim())
          .filter(Boolean)
      )
    ]

    if (!subjectList.length) {
      setError('Please enter at least one subject.')
      return false
    }

    if (!examDate) {
      setError('Please select your exam date.')
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const exam = new Date(`${examDate}T00:00:00`)

    if (Number.isNaN(exam.getTime()) || exam <= today) {
      setError('Please select an exam date in the future.')
      return false
    }

    const dailyHours = Number(hours)

    if (
      !Number.isInteger(dailyHours) ||
      dailyHours < 1 ||
      dailyHours > 8
    ) {
      setError('Choose between 1 and 8 study hours per day.')
      return false
    }

    const totalDays = Math.ceil(
      (exam.getTime() - today.getTime()) / 86400000
    )

    // Generate a maximum of 30 days, as in the original planner.
    const daysToPlan = Math.min(totalDays, 30)
    const newPlan = []

    for (let dayIndex = 0; dayIndex < daysToPlan; dayIndex++) {
      const date = new Date(today)
      date.setDate(today.getDate() + dayIndex)

      const sessions = []

      for (let hourIndex = 0; hourIndex < dailyHours; hourIndex++) {
        const subjectIndex =
          (dayIndex * dailyHours + hourIndex) % subjectList.length

        const subject = subjectList[subjectIndex]
        const existing = sessions.find(
          session => session.subject === subject
        )

        if (existing) {
          existing.hours += 1
        } else {
          sessions.push({
            id: `${dayIndex}-${subjectIndex}`,
            subject,
            hours: 1,
            completed: false,
            completedAt: null
          })
        }
      }

      newPlan.push({
        id: `day-${dateKey(date)}`,
        dateKey: dateKey(date),
        date: displayDate(date),
        sessions
      })
    }

    setPlan(newPlan)
    return true
  }

  function toggleTask(dayId, sessionId) {
    setPlan(current =>
      current.map(day =>
        day.id !== dayId
          ? day
          : {
              ...day,
              sessions: day.sessions.map(session => {
                if (session.id !== sessionId) return session

                const completed = !session.completed

                return {
                  ...session,
                  completed,
                  completedAt: completed
                    ? new Date().toISOString()
                    : null
                }
              })
            }
      )
    )
  }

  function editTask(dayId, sessionId) {
    const day = plan.find(item => item.id === dayId)
    const task = day?.sessions.find(item => item.id === sessionId)

    if (!task) return

    const subject = window.prompt(
      'Enter the updated subject name:',
      task.subject
    )

    if (subject === null || !subject.trim()) return

    const hoursText = window.prompt(
      'Enter study hours (1–8):',
      String(task.hours)
    )

    if (hoursText === null) return

    const hours = Number(hoursText)

    if (!Number.isInteger(hours) || hours < 1 || hours > 8) {
      window.alert('Enter a whole number between 1 and 8.')
      return
    }

    setPlan(current =>
      current.map(day =>
        day.id !== dayId
          ? day
          : {
              ...day,
              sessions: day.sessions.map(session =>
                session.id !== sessionId
                  ? session
                  : {
                      ...session,
                      subject: subject.trim(),
                      hours
                    }
              )
            }
      )
    )
  }

  function deleteTask(dayId, sessionId) {
    setPlan(current =>
      current
        .map(day =>
          day.id !== dayId
            ? day
            : {
                ...day,
                sessions: day.sessions.filter(
                  session => session.id !== sessionId
                )
              }
        )
        .filter(day => day.sessions.length > 0)
    )
  }

  function clearPlan() {
    if (window.confirm('Delete your entire saved study plan?')) {
      setPlan([])
      setError('')
    }
  }

  const totalTasks = plan.reduce(
    (total, day) => total + day.sessions.length,
    0
  )

  const completedTasks = plan.reduce(
    (total, day) =>
      total + day.sessions.filter(session => session.completed).length,
    0
  )

  const totalHours = plan.reduce(
    (total, day) =>
      total +
      day.sessions.reduce(
        (sum, session) => sum + Number(session.hours || 0),
        0
      ),
    0
  )

  const completedHours = plan.reduce(
    (total, day) =>
      total +
      day.sessions.reduce(
        (sum, session) =>
          sum +
          (session.completed ? Number(session.hours || 0) : 0),
        0
      ),
    0
  )

  return (
    <StudyContext.Provider
      value={{
        plan,
        error,
        setError,
        generatePlan,
        toggleTask,
        editTask,
        deleteTask,
        clearPlan,
        totalTasks,
        completedTasks,
        totalHours,
        completedHours
      }}
    >
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)

  if (!context) {
    throw new Error('useStudy must be used inside StudyProvider')
  }

  return context
}