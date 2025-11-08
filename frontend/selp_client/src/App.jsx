
import './App.css'
import './components/components.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from '../login-app/src/Login';
import Admin from '../admin-app/src/Admin';
import AdminAddItem from '../admin-app/src/AdminAddItem';
import AdminDeleteItem from '../admin-app/src/AdminDeleteItem';
import AdminEditItem from '../admin-app/src/AdminEditItem';
import Student from '../student-app/src/Student';
import StudentRequestList from '../student-app/src/StudentRequestList';
import Staff from '../staff-app/src/Staff';


import React, { createContext, useContext, useState } from 'react';


export const AuthContext = createContext(null);

// Custom hook to consume the AuthContext easily
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [username, setUserName] = useState(null); 
  const [role, setRole] = useState(null);

  const loginUser = (userData, name, userRole = null) => {
    setUser(userData);
    setUserName(name);
    setRole(userRole);
    console.log("Session established for user:", userData, name, userRole);
  };

    // Function to clear user data on sign out
    const logoutUser = () => {
        setUser(null);
        setUserName(null);
    setRole(null);
    };

    const value = {
        user,
        username,
    role,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

function App() {

  
  return (
    <AuthProvider>
    <Router>
          <Layout>
            <Routes>
              <Route path="" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/AdminAddItem" element={<AdminAddItem />} />
              <Route path="/AdminEditItem" element={<AdminEditItem />} />
              <Route path="/AdminDeleteItem" element={<AdminDeleteItem />} />
              <Route path="/student" element={<StudentRequestList />} />
              <Route path="/studentList" element={<Student />} />
              <Route path="/staff" element={<Staff />} />
              {/* Other routes */}
            </Routes>
          </Layout>
    </Router>
    </AuthProvider>
  )
}

export default App
