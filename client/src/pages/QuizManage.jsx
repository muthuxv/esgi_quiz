import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import io from 'socket.io-client';
//mui
import { Button, Grid, Typography, Box, Paper, Card, CardContent, CardActions, CardHeader, Alert } from '@mui/material';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const decoded = jwtDecode(localStorage.getItem('token'));
  console.log(decoded);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      const decodedUser = { login: decoded.login, id: decoded.id };
      newSocket.emit('joinQuiz', id, decodedUser);
  });

    newSocket.on('userJoined', (user) => {
      //check if the user is already in the list
      if (connectedUsers.some((u) => u.id === user.id)) {
        return;
      }
      // Add the user to the list of connected users
      setConnectedUsers(prevUsers => [...prevUsers, user]);
    });

    return () => newSocket.close();
  }, [id, decoded.login, decoded.id, connectedUsers]);

  useEffect(() => {
    const checkQuizExists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setQuizData(data);
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

    if (socket) {
      checkQuizExists();
    }
  }, [id, navigate, socket]);

  const handleStartQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:3001/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quiz_id: id }),
      });
      if (response.ok) {
        const data = await response.json();
      
        connectedUsers.forEach(async (user) => {
          await fetch(`http://localhost:3001/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room_id: data.id }),
          });
        }
        );
        navigate(`/play/${data.id}/${id}`);
      } else {
        console.error('Error while creating room:', response);
      }
    } catch (error) {
      console.error('Error while creating room:', error);
    }
  };

  if (isLoading) {
    return <Alert severity="info">Chargement...</Alert>;
  }

  return (
    <>
        <Typography variant="h4" sx={{ mb: 2 }}> Bienvenue sur votre quiz: {quizData && quizData.title}</Typography>
        {quizData && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper>
              <Card>
                <CardHeader title="Liste des participants" />
                <CardContent>
                  <Typography variant="body1">
                    {connectedUsers.map((user, index) => (
                      <Box key={index}>{user.login}</Box>
                    ))}
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => handleStartQuiz()}>
                    Commencer le quiz
                  </Button>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper>
              <Card>
                <CardHeader title="Nombre de questions" />
                <CardContent>
                  <Typography variant="body1">{quizData.questions.length}</Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
        )}
    </>
  );
};

export default Quiz;