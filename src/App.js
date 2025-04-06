import logo from './logo.svg';
import './App.css';
import Registration from './Components/Registration';
import VerifyEmail from './Components/VerifyEmail';
import ResendVerificationToken from './Components/ResendVerificationToken';
import Login from './Components/Login';
import FpToken from './Components/FpToken';
import ChangePassword from './Components/ChangePassword';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SecuredApi from './Components/SecuredApi';
import { AuthProvider } from './ContextStore/AuthenticationContext';
import TaskList from './Components/TaskList';
import Home from './Components/Home';
import AddTask from './Components/AddTask';
import EditTask from './Components/EditTask';



function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-verification-token" element={<ResendVerificationToken />} />
            <Route path="/fp-token" element={<FpToken />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/secured-api" element={<SecuredApi />} />
            <Route path="/all-tasks" element={<TaskList />} />
            <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
            <Route path="/home" element={<Home />} />
            <Route path="/tasks/add" element={<AddTask />} />
            <Route path="/tasks/edit/:id" element={<EditTask />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
