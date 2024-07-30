import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyPage from './Pages/MyPage';
import Procedure from './Pages/Procedure';
import Runs from './Pages/Runs';
import Assets from './Pages/Assets';
import Settings from './Pages/Settings';
import Profile from './Pages/Profile';
import Newprocedure from './Pages/Procedure/Newprocedure';
import MainLayout from './Components/MainLayout';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<MainLayout><MyPage /></MainLayout>} />}
          />
          <Route
            path="/procedure"
            element={<ProtectedRoute element={<MainLayout><Procedure /></MainLayout>} />}
          />
          <Route
            path="/newprocedure"
            element={<ProtectedRoute element={<MainLayout><Newprocedure /></MainLayout>} />}
          />
          <Route
            path="/runs"
            element={<ProtectedRoute element={<MainLayout><Runs /></MainLayout>} />}
          />
          <Route
            path="/assets"
            element={<ProtectedRoute element={<MainLayout><Assets /></MainLayout>} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute element={<MainLayout><Settings /></MainLayout>} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<MainLayout><Profile /></MainLayout>} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
