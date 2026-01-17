import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Lists from './pages/Lists'
import ListDetail from './pages/ListDetail'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="container">Loading...</div>
  }
  
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Lists />} />
        <Route path="lists/:listId" element={<ListDetail />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
