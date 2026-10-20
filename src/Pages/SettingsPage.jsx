import { useGoals } from '../context/GoalsContext'
import { useStudy } from '../context/StudyContext'

export default function SettingsPage() {
  const { clearPlan } = useStudy()
  const { clearGoals } = useGoals()

  return (
    <div className="page">
      <section className="page-heading">
        <p className="eyebrow">PERSONALIZE YOUR SPACE</p>
        <h1>Settings ⚙️</h1>
        <p>Manage your saved study plans and goals.</p>
      </section>

      <section className="panel settings-card">
        <h2>Saved Data</h2>
        <p>
          Your study plan and goals are stored separately in this browser's
          local storage.
        </p>

        <div className="setting-row">
          <div>
            <h3>Study Plan</h3>
            <p>Remove all generated study tasks and schedule information.</p>
          </div>
          <button
            className="danger-btn"
            type="button"
            onClick={clearPlan}
          >
            Clear Study Plan
          </button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Study Goals</h3>
            <p>Remove all goals created on the Goals page.</p>
          </div>
          <button
            className="danger-btn"
            type="button"
            onClick={clearGoals}
          >
            Clear Goals
          </button>
        </div>
      </section>

      <section className="panel settings-card">
        <h2>About this application</h2>
        <p><strong>Application:</strong> AI Study Planner</p>
        <p><strong>Frontend:</strong> React and Vite</p>
        <p><strong>Charts:</strong> Recharts</p>
        <p><strong>Navigation:</strong> React Router</p>
        <p>
          The study schedule is generated from your inputs. It does not
          currently use an external AI service.
        </p>
      </section>
    </div>
  )
}