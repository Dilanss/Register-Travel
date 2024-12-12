import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login.jsx';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home.jsx';

const App = () => {
    return (
      <div>
        <Router>
          <Routes>
          <Route path='/' exact element={<Root />} />
            <Route path='/dashboard' exact element={<Home />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/signup' exact element={<SignUp />} />
          </Routes>
        </Router>
      </div>
    )
}

// Define the Root componenen the handle he initial redirect
const Root = () => {
  // Check if tokex exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Rediresct to dashboard if autenticated otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" /> 
  ) : (
    <Navigate to="/login" />
  );
};

export default App