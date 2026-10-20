import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <span>🔎</span>
      <h1>404 — Page Not Found</h1>
      <p>Sorry, the page you are looking for doesn't exist.</p>
      <Link to="/" className="primary-btn link-btn">
        Back to Dashboard
      </Link>
    </div>
  )
}