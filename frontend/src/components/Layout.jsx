import { Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Layout() {
  const { user, logout } = useAuth()

  return (
    <div>
      <header style={{
        background: 'white',
        padding: '16px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Buy List</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Hello, {user?.name || user?.email}</span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

