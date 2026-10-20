import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { Link } from 'react-router-dom'
import StatCard from '../Components/StatCard'
import { useStudy } from '../context/StudyContext'
import { useGoals } from '../context/GoalsContext'

function getDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-')
}

export default function Dashboard() {
  const {
    plan,
    totalTasks,
    completedTasks,
    totalHours,
    completedHours
  } = useStudy()

  const { goals } = useGoals()

  const completedGoals = goals.filter(goal => goal.completed).length
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))

    const key = getDateKey(date)

    const hours = plan.reduce(
      (total, day) =>
        total +
        day.sessions.reduce((sum, session) => {
          if (!session.completed || !session.completedAt) return sum

          const completedDate = new Date(session.completedAt)

          return getDateKey(completedDate) === key
            ? sum + Number(session.hours || 0)
            : sum
        }, 0),
      0
    )

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hours
    }
  })

  return (
    <div className="page">
      <section className="welcome-banner">
        <p className="eyebrow">YOUR LEARNING OVERVIEW</p>
        <h1>Welcome to your Dashboard 👋</h1>
        <p>Small steps every day lead to big achievements.</p>

        <Link to="/study-plan" className="primary-btn link-btn">
          Create Study Plan
        </Link>
      </section>

      <section className="stats-grid">
        <StatCard
          icon="📚"
          title="Total Tasks"
          value={totalTasks}
          description="Tasks in your plan"
        />
        <StatCard
          icon="✅"
          title="Completed Tasks"
          value={completedTasks}
          description="Tasks finished"
        />
        <StatCard
          icon="⏰"
          title="Planned Hours"
          value={`${totalHours} hrs`}
          description="Scheduled study time"
        />
        <StatCard
          icon="🎯"
          title="Goals Completed"
          value={`${completedGoals}/${goals.length}`}
          description="Personal study goals"
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-card">
          <div className="section-heading">
            <div>
              <h2>Weekly Study Progress</h2>
              <p>Hours completed on each of the last seven days</p>
            </div>
            <span className="chart-icon">📈</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="hours"
                name="Completed hours"
                fill="#6554d9"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel progress-card">
          <h2>Study Plan Progress</h2>
          <p>Tasks completed in your current plan</p>

          <div className="progress-number">{progress}%</div>

          <div
            className="progress-bar"
            role="progressbar"
            aria-label="Study plan completion"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p>{completedTasks} of {totalTasks} tasks completed</p>
          <p>{completedHours} study hours completed</p>

          <Link to="/study-plan" className="text-link">
            View study plan →
          </Link>
        </article>
      </section>

      <section className="panel upcoming-card">
        <div className="section-heading">
          <div>
            <h2>Your Goals</h2>
            <p>Keep moving towards your learning targets.</p>
          </div>
          <Link to="/goals" className="text-link">Manage goals →</Link>
        </div>

        {goals.length === 0 ? (
          <p className="muted-text">No goals added yet.</p>
        ) : (
          goals.slice(0, 4).map(goal => (
            <div className="dashboard-goal" key={goal.id}>
              <span>{goal.completed ? '✅' : '🎯'}</span>
              <div>
                <strong>{goal.title}</strong>
                <p>Target date: {goal.targetDate}</p>
              </div>
              <span className="goal-hours">{goal.targetHours} hrs</span>
            </div>
          ))
        )}
      </section>
    </div>
  )
}