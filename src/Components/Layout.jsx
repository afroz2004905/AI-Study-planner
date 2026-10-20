import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">📚 StudyPlanner</div>

        <nav className="navigation">
          <NavLink to="/" end>🏠 Dashboard</NavLink>
          <NavLink to="/study-plan">📅 Study Plan</NavLink>
          <NavLink to="/goals">🎯 My Goals</NavLink>
          <NavLink to="/settings">⚙️ Settings</NavLink>
        </nav>

        <div className="sidebar-footer">
          Study smart. Stay consistent.
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <strong>My Learning Space</strong>
            <p>Plan your learning, one day at a time.</p>
          </div>
          <span className="profile-badge">📖</span>
        </header>

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="footer">
          AI Study Planner · Built for better learning
        </footer>
      </div>
    </div>
  )
}