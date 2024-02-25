import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import { Button, Grid, TextField, Typography, Box, Paper, Card, CardContent, CardActions, CardHeader, Alert, Switch, FormControlLabel } from '@mui/material';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [questionTime, setQuestionTime] = useState(30);
  const [isShuffle, setIsShuffle] = useState(false); 

  useEffect(() => {
    const decoded = jwtDecode(localStorage.getItem('token'));
    console.log(decoded);

    const newSocket = io('http://195.35.29.110:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      const decodedUser = { login: decoded.login, id: decoded.id };
      newSocket.emit('joinQuiz', id, "");
    });

    newSocket.on('userJoined', (user) => {
      if (!connectedUsers.some((u) => u.id === user.id)) {
        setConnectedUsers(prevUsers => [...prevUsers, user]);
      }
    });

    newSocket.on('userLeft', (user) => {
      setConnectedUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
    });

    return () => newSocket.close();
  }, [id, connectedUsers]);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/quizzes/${id}`);
        if (response.ok) {
          const quizDetails = await response.json();
          setIsShuffle(quizDetails.isShuffle);
        }
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    fetchQuizDetails();
  }, [id]);

  useEffect(() => {
    const checkQuizExists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://195.35.29.110:3001/quizzes/${id}`);
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

  const handleChangeQuestionTime = () => {
    socket.emit('changeQuestionTime', id, questionTime);
    console.log(`Time changed to ${questionTime} seconds`);
  };

  const handleStartQuiz = async () => {
    try {
      const response = await fetch(`http://195.35.29.110:3001/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quiz_id: id }),
      });
      if (response.ok) {
        const data = await response.json();
        await Promise.all(connectedUsers.map(user =>
          fetch(`http://195.35.29.110:3001/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room_id: data.id }),
          })
        ));
        socket.emit('startQuiz', data.id, id);
      } else {
        console.error('Error while creating room:', response);
      }
    } catch (error) {
      console.error('Error while creating room:', error);
    }
  };

  const handleShuffleChange = async (event) => {
    const newIsShuffle = event.target.checked;
    try {
      const response = await fetch(`http://localhost:3001/quizzes/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isShuffle: newIsShuffle }),
      });
      if (response.ok) {
        setIsShuffle(newIsShuffle);
        console.log(`Questions shuffle set to ${newIsShuffle}.`);
      } else {
        console.error('Error while setting questions shuffle:', response);
      }
    } catch (error) {
      console.error('Error while setting questions shuffle:', error);
    }
  };

  return (
    <>
      {isLoading && <Alert severity="info">Loading...</Alert>}
      {quizData && (
        <>
        <Typography variant="h4" sx={{ mb: 2 }}>Bienvenue sur votre quiz: {quizData.title}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper>
              <Card>
                <CardHeader title="Liste des participants" />
                <CardContent>
                  {connectedUsers.map((user, index) => (
                    <Typography key={index} variant="body1" component="div">
                      <Box>{user.login}</Box>
                    </Typography>
                  ))}
                  <Button variant="contained" color="primary" onClick={handleStartQuiz}>
                    Commencer le quiz
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isShuffle}
                        onChange={handleShuffleChange}
                        color="primary"
                      />
                    }
                    label="Mélanger les questions"
                  />
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper>
              <Card>
                <CardHeader title="Modifier le temps des questions" />
                <CardContent>
                  <TextField
                    label="Temps en secondes"
                    type="number"
                    value={questionTime}
                    onChange={(e) => setQuestionTime(e.target.value)}
                  />
                  <Button variant="contained" color="primary" onClick={handleChangeQuestionTime}>
                    Modifier le temps
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
        </>
      )}
    </>
  );
};

export default Quiz;
