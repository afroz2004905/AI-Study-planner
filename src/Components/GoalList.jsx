import { useGoals } from '../context/GoalsContext'

export default function GoalList() {
  const { goals, toggleGoal, editGoal, deleteGoal } = useGoals()

  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <span>🎯</span>
        <h3>No goals yet</h3>
        <p>Create your first study goal using the form.</p>
      </div>
    )
  }

  return (
    <section className="goal-list">
      <h2>Your Study Goals ({goals.length})</h2>

      {goals.map(goal => (
        <article
          className={`goal-card ${goal.completed ? 'goal-completed' : ''}`}
          key={goal.id}
        >
          <div className="goal-card-heading">
            <label className="goal-check">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
              />
              <span>{goal.title}</span>
            </label>

            <span className={`status-pill ${goal.completed ? 'done' : ''}`}>
              {goal.completed ? 'Completed' : 'In progress'}
            </span>
          </div>

          {goal.description && <p>{goal.description}</p>}

          <div className="goal-meta">
            <span>📅 Due: {goal.targetDate}</span>
            <span>⏱️ Target: {goal.targetHours} hours</span>
          </div>

          <div className="task-actions">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => {
                const title = window.prompt('Goal title:', goal.title)
                if (title === null || !title.trim()) return

                const description = window.prompt(
                  'Goal description:',
                  goal.description
                )
                if (description === null) return

                const targetDate = window.prompt(
                  'Target date (YYYY-MM-DD):',
                  goal.targetDate
                )
                if (
                  targetDate === null ||
                  !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)
                ) return

                const parsedDate = new Date(`${targetDate}T00:00:00`)
                if (
                  Number.isNaN(parsedDate.getTime()) ||
                  parsedDate.toISOString().slice(0, 10) !== targetDate
                ) {
                  window.alert('Enter a valid date in YYYY-MM-DD format.')
                  return
                }

                const hoursText = window.prompt(
                  'Target hours (1–500):',
                  String(goal.targetHours)
                )
                if (hoursText === null) return

                const targetHours = Number(hoursText)
                if (
                  !Number.isInteger(targetHours) ||
                  targetHours < 1 ||
                  targetHours > 500
                ) {
                  window.alert('Target hours must be from 1 to 500.')
                  return
                }

                editGoal(goal.id, {
                  title,
                  description,
                  targetDate,
                  targetHours
                })
              }}
            >
              Edit
            </button>

            <button
              className="danger-btn"
              type="button"
              onClick={() => {
                if (window.confirm('Delete this goal?')) {
                  deleteGoal(goal.id)
                }
              }}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}