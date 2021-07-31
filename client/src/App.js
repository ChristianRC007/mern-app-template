import { BrowserRouter } from 'react-router-dom'
import useAuth from './hooks/auth.hook'
import { useRoutes } from './routes'
import { AuthContext } from './context/authContext'
import NavBar from './components/NavBar'
import Loader from './components/Loader'
import 'materialize-css'

function App() {
  const { login, logout, token, userId, ready } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider
      value={{ token, userId, login, logout, isAuthenticated }}
    >
      <BrowserRouter>
        {isAuthenticated && <NavBar />}

        <div className="container">{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
