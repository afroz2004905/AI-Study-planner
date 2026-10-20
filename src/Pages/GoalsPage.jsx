import GoalForm from '../Components/GoalForm'
import GoalList from '../Components/GoalList'

export default function GoalsPage() {
  return (
    <div className="page">
      <section className="page-heading">
        <p className="eyebrow">YOUR PERSONAL TARGETS</p>
        <h1>My Study Goals 🎯</h1>
        <p>Set clear goals, track your progress, and celebrate your learning.</p>
      </section>

      <div className="goals-layout">
        <GoalForm />
        <GoalList />
      </div>
    </div>
  )
}