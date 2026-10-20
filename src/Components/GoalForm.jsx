import { useState } from 'react'
import { useGoals } from '../context/GoalsContext'


export default function GoalForm() {
  const { addGoal } = useGoals()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [targetHours, setTargetHours] = useState('5')
  const [error, setError] = useState('')

  const today = new Date()
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Please enter a goal title.')
      return
    }

    if (!targetDate || targetDate < minDate) {
      setError('Choose today or a future target date.')
      return
    }

    const hours = Number(targetHours)

    if (!Number.isInteger(hours) || hours < 1 || hours > 500) {
      setError('Target hours must be between 1 and 500.')
      return
    }

    addGoal({ title, description, targetDate, targetHours: hours })

    setTitle('')
    setDescription('')
    setTargetDate('')
    setTargetHours('5')
    setError('')
  }

  return (
    <form className="panel goal-form" onSubmit={handleSubmit}>
      <h2>Create a Study Goal</h2>

      <label htmlFor="goal-title">Goal title</label>
      <input
        id="goal-title"
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="Example: Complete React basics"
        maxLength={100}
        required
      />

      <label htmlFor="goal-description">Description</label>
      <textarea
        id="goal-description"
        value={description}
        onChange={event => setDescription(event.target.value)}
        placeholder="What do you want to achieve?"
        rows="3"
        maxLength={500}
      />

      <div className="form-row">
        <div>
          <label htmlFor="goal-date">Target date</label>
          <input
            id="goal-date"
            type="date"
            min={minDate}
            value={targetDate}
            onChange={event => setTargetDate(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="goal-hours">Target hours</label>
          <input
            id="goal-hours"
            type="number"
            min="1"
            max="500"
            value={targetHours}
            onChange={event => setTargetHours(event.target.value)}
            required
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="primary-btn" type="submit">
        + Add Goal
      </button>
    </form>
  )
}