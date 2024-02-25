import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizManage from './pages/QuizManage';
import Navbar from './components/Navbar';
import AdminBoard from './pages/AdminBoard';
import Game from './pages/Game';
import Result from './pages/Result';
import Login from './pages/security/Login';
import Register from './pages/security/Register';
import ForgotPassword from './pages/security/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import FindQuizzes from './pages/FindQuizzes';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/quiz-manage/:id" element={<ProtectedRoute><QuizManage /></ProtectedRoute>} />
          <Route path="/play/:roomId/:quizId" element={<ProtectedRoute><Game /></ProtectedRoute>} />
          <Route path="/results/:roomId/:quizId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminBoard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-quizzes" element={<ProtectedRoute><FindQuizzes /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
  );
}

export default App;

