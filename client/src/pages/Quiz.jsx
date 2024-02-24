import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizExists, setQuizExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkQuizExists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setQuizExists(true);
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error while fetching quiz:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkQuizExists();
    const socket = io('http://localhost:3001');
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      socket.emit('joinQuiz', id, decoded.login);
    }
    return () => {
      const token = localStorage.getItem('token');
      if (socket && token) {
          const decoded = jwtDecode(token);
          socket.emit('leaveQuiz', id, decoded.login);
          socket.close();
      }
    };
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {quizExists ? <div>Le quiz va commencer</div> : <div>Redirection...</div>}
    </div>
  );
};

export default Quiz;
