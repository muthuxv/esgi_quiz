import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizManage from './pages/QuizManage';
import Navbar from './components/Navbar';
import AdminBoard from './pages/AdminBoard';
import Login from './pages/security/Login';
import Register from './pages/security/Register';
import ForgotPassword from './pages/security/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/quiz-manage/:id" element={<ProtectedRoute><QuizManage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminBoard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
  );
}

export default App;
