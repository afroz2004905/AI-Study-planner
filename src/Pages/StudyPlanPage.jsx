import { useState } from 'react'
import { useStudy } from '../context/StudyContext'

export default function StudyPlanPage() {
  const {
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
  } = useStudy()

  const [subjects, setSubjects] = useState('React, JavaScript, CSS')
  const [examDate, setExamDate] = useState('')
  const [hours, setHours] = useState('2')

  const today = new Date()
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  function handleSubmit(event) {
    event.preventDefault()
    generatePlan(subjects, examDate, hours)
  }

  return (
    <div className="page">
      <section className="page-heading">
        <p className="eyebrow">PLAN YOUR SUCCESS</p>
        <h1>AI Study Plan Generator</h1>
        <p>Organize your subjects and prepare for your exams step by step.</p>
      </section>

      <form className="panel planner-form" onSubmit={handleSubmit}>
        <h2>Create Your Study Plan</h2>

        <label htmlFor="subjects">Subjects (separate with commas)</label>
        <textarea
          id="subjects"
          value={subjects}
          onChange={event => {
            setSubjects(event.target.value)
            setError('')
          }}
          placeholder="React, JavaScript, CSS"
          rows="3"
          required
        />

        <div className="form-row">
          <div>
            <label htmlFor="exam-date">Exam date</label>
            <input
              id="exam-date"
              type="date"
              min={minDate}
              value={examDate}
              onChange={event => {
                setExamDate(event.target.value)
                setError('')
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="daily-hours">Study hours per day</label>
            <select
              id="daily-hours"
              value={hours}
              onChange={event => setHours(event.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(number => (
                <option key={number} value={number}>
                  {number} {number === 1 ? 'hour' : 'hours'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="primary-btn" type="submit">
          ✨ Generate My Study Plan
        </button>

        <p className="form-hint">
          The planner creates up to 30 days of study tasks, ending before your
          selected exam date.
        </p>
      </form>

      {plan.length > 0 && (
        <>
          <section className="stats-grid">
            <div className="panel mini-stat">
              <span>📚 Total Tasks</span>
              <strong>{totalTasks}</strong>
            </div>
            <div className="panel mini-stat">
              <span>✅ Completed</span>
              <strong>{completedTasks}</strong>
            </div>
            <div className="panel mini-stat">
              <span>⏰ Planned Hours</span>
              <strong>{totalHours} hrs</strong>
            </div>
            <div className="panel mini-stat">
              <span>🎯 Hours Completed</span>
              <strong>{completedHours} hrs</strong>
            </div>
          </section>

          <section className="panel plan-progress">
            <div className="section-heading">
              <div>
                <h2>Your Study Progress</h2>
                <p>{completedTasks} of {totalTasks} tasks completed</p>
              </div>
              <strong className="progress-number">{progress}%</strong>
            </div>

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

            {progress === 100 && (
              <p className="success-message">
                🎉 Excellent! You've completed every task in this plan.
              </p>
            )}
          </section>

          <section className="schedule-section">
            <div className="section-heading">
              <div>
                <h2>Your Daily Schedule</h2>
                <p>Check off each session as you finish it.</p>
              </div>
              <span className="muted-text">{plan.length} days</span>
            </div>

            {plan.map((day, index) => (
              <article className="panel day-card" key={day.id}>
                <h3>Day {index + 1} — {day.date}</h3>

                {day.sessions.map(session => (
                  <div
                    className={`session ${
                      session.completed ? 'session-completed' : ''
                    }`}
                    key={session.id}
                  >
                    <label className="session-info">
                      <input
                        type="checkbox"
                        checked={session.completed}
                        onChange={() => toggleTask(day.id, session.id)}
                      />
                      <span className="session-subject">
                        📘 {session.subject}
                        <small>
                          {session.hours}{' '}
                          {session.hours === 1 ? 'hour' : 'hours'}
                        </small>
                      </span>
                    </label>

                    <div className="task-actions">
                      <span className="task-status">
                        {session.completed ? 'Completed ✓' : 'Pending'}
                      </span>

                      <button
                        className="secondary-btn"
                        type="button"
                        onClick={() => editTask(day.id, session.id)}
                      >
                        Edit
                      </button>

                      <button
                        className="danger-btn"
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this study task?')) {
                            deleteTask(day.id, session.id)
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </section>

          <button
            className="danger-btn clear-plan-btn"
            type="button"
            onClick={clearPlan}
          >
            Delete Saved Plan
          </button>
        </>
      )}

      {plan.length === 0 && (
        <div className="empty-state">
          <span>📅</span>
          <h3>Your schedule starts here</h3>
          <p>Fill in your subjects and exam date to generate your plan.</p>
        </div>
      )}
    </div>
  )
}