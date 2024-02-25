import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizExists, setQuizExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://195.35.29.110:3001');
    }

    const checkQuizExists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://195.35.29.110:3001/quizzes/${id}`);
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

    const token = localStorage.getItem('token');
    if (token && socketRef.current) {
      const decoded = jwtDecode(token);
      const decodedUser = { login: decoded.login, id: decoded.id };
      socketRef.current.emit('joinQuiz', id, decodedUser);
    }

    socketRef.current.on('quizStarted', (roomId, quizId) => {
      try {
        console.log('Quiz has started:', roomId, quizId);
        navigate(`play/${roomId}/${quizId}`);
      } catch (error) {
        console.error('Error navigating to play:', error);
      }
    });

    return () => {
      const token = localStorage.getItem('token');
      if (socketRef.current && token) {
        const decoded = jwtDecode(token);
        const decodedUser = { login: decoded.login, id: decoded.id };
        socketRef.current.emit('leaveQuiz', id, decodedUser);
        socketRef.current.close();
        socketRef.current = null;
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
