import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
//mui
import { Paper, Typography, Button, Grid, TextField, Container } from '@mui/material';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizExists, setQuizExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quiz, setQuiz] = useState();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [goodPassword, setGoodPassword] = useState(false);

  const handlePasswordSubmit = () => {
    if (password === quiz.password) {
      setErrorMessage('');
        setGoodPassword(true);
    } else {
      setErrorMessage('Mauvais mot de passe');
    }
  };

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3001');
    }

    const checkQuizExists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setQuizExists(true);
            setQuiz(data);
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
      console.log(decodedUser);
      socketRef.current.emit('joinQuiz', id, decodedUser);
    }

    socketRef.current.on('quizStarted', (roomId, quizId) => {
      try {
        console.log('Quiz has started:', roomId, quizId);
        navigate(`/play/${roomId}/${quizId}`);
      } catch (error) {
        console.error('Error navigating to play:', error);
      }
    });

    
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      if (socketRef.current && token) {
        const decoded = jwtDecode(token);
        const decodedUser = { login: decoded.login, id: decoded.id };
        socketRef.current.emit('leaveQuiz', id, decodedUser);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <Container>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center', color: 'primary', backgroundColor: 'primary' }}>
          {quizExists ? (
              !goodPassword ? (
                  <div>
                    {errorMessage && (
                        <Typography variant="body2" color="error">
                          {errorMessage}
                        </Typography>
                    )}

                    <TextField
                        label="Mot de passe du quiz"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handlePasswordSubmit}>
                      Valider
                    </Button>
                  </div>
              ) : (
                  <Typography variant="h4" component="h1">
                    En attente du début du quiz...
                  </Typography>
              )
          ) : (
              <Typography variant="h4" component="h1">
                Le quiz n'existe pas.
              </Typography>
          )}
        </Paper>
      </Container>
  );
};

export default Quiz;
