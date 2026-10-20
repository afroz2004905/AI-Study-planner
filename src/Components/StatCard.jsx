export default function StatCard({ icon, title, value, description }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{title}</span>
      </div>

      <h3>{value}</h3>

      {description && (
        <p className="stat-description">{description}</p>
      )}
    </article>
  )
}