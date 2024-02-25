import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button, TextField, Alert } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const { roomId, quizId } = useParams();
    const socketRef = useRef(null);
    const [question, setQuestion] = useState(null);
    const [count, setCount] = useState(0);
    const [answerFeedback, setAnswerFeedback] = useState({ message: '', isCorrect: null });
    const [disableAnswers, setDisableAnswers] = useState(false);
    const [timer, setTimer] = useState(30);
    const [optionCounters, setOptionCounters] = useState({});
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [notification, setNotification] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        setCurrentUser(jwtDecode(token).login);

        if (!socketRef.current) {
            socketRef.current = io('http://195.35.29.110:3001');
        }

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            socketRef.current.emit('nextQuestion', roomId, quizId, count);
            setNotification('Le quiz a commencé');
        });

        socketRef.current.on('timer', (timeLeft) => {
            setTimer(timeLeft);
        });

        socketRef.current.on('timerWarning', (timeLeft) => {
            setNotification(`Il reste ${timeLeft} secondes`);
        });
    
        socketRef.current.on('nextQuestion', (receivedQuizId, receivedQuestion, receivedCount) => {
            if (receivedQuizId === quizId) {
                setQuestion(receivedQuestion);
                setAnswerFeedback('');
                setDisableAnswers(false);
                setCount(receivedCount);
                setTimer(30);
                
                if (receivedCount === 0) {
                    setNotification('Le quiz a commencé');
                } else {
                    setNotification('Question suivante');
                }

            }
        });

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            if (socketRef.current && token) {
                const decoded = jwtDecode(token);
                const decodedUser = { login: decoded.login, quizId: decoded.id };
                socketRef.current.emit('leaveQuiz', quizId, decodedUser);
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);

        socketRef.current.on('answerQuestion', (receivedRoomId, receivedQuizId, receivedQuestionId, receivedUser, receivedAnswer, receivedCount) => {
            if (receivedRoomId === roomId && receivedQuizId === quizId) {
              console.log("Time's up, moving to next question");
              setCount(receivedCount);
              socketRef.current.emit('nextQuestion', roomId, quizId, receivedCount);
            }
        });

        socketRef.current.on('updateOptionCounter', (receivedQuestionId, counters) => {
            if (question && receivedQuestionId === question.id) {
                setOptionCounters(prevCounters => ({
                    ...prevCounters,
                    ...counters
                }));
            }
        });

        socketRef.current.on('chatMessage', (message) => {
            setChatMessages(prevMessages => [...prevMessages, message]);
        });

        socketRef.current.on('quizEnded', (receivedRoomId, receivedQuizId) => {
            if (receivedRoomId === roomId && receivedQuizId === quizId) {
                navigate(`/results/${roomId}/${quizId}`);
            }
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            socketRef.current.off('updateOptionCounter');
            socketRef.current.off('chatMessage');
        };
    }, [roomId, quizId, count, question, navigate]);

    const handleOptionClick = async (selectedOption) => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const decodedUser = { login: decoded.login, id: decoded.id };
        console.log('Option selected:', selectedOption);

        setDisableAnswers(true);

        setAnswerFeedback({
            message: selectedOption.isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse !',
            isCorrect: selectedOption.isCorrect,
        });
        // save the answer
        try {
            const response = await fetch(`http://195.35.29.110:3001/responses`, {
              method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isCorrect: selectedOption.isCorrect,
                    user_id: decodedUser.id,
                    question_id: question.id,
                    option_id: selectedOption.id,
                    room_id: roomId,
                }),
            });
            if (response.ok) {
                console.log('Answer saved');
            } else {
                console.error('Error while saving answer:', response);
            }
        } catch (error) {
            console.error('Error while saving answer:', error);
        }

        socketRef.current.emit('answerQuestion', roomId, quizId, question.id, decodedUser.id, selectedOption.id, count);
    };

    const sendChatMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return; 

        const user = jwtDecode(localStorage.getItem('token')).login;
        socketRef.current.emit('sendChatMessage', roomId, user, chatInput);
        setChatInput('');
    };

    useEffect(() => {
        if (notification) {
            const timeout = setTimeout(() => {
                setNotification('');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [notification]);

    return (
        <Box>
            <Grid>
                <Typography variant="h3" sx={{ mb: 2 }} gutterBottom>Quiz</Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Box p={2}>
                            <Box sx={{ mb: 2, display: 'flex', gap: '25vw' }}>
                                <Typography variant="h5">Time left: {timer} seconds</Typography>
                                {notification && <Alert severity="info">{notification}</Alert>}
                            </Box>
                            {question && (
                                <>
                                    <Typography variant="h4">Question: {question.text}</Typography>
                                    <Typography variant="h5">Options:</Typography>
                                    {question.options.map(option => (
                                        <Button
                                            key={option.id}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={disableAnswers}
                                            style={{
                                                backgroundColor: disableAnswers ? '#e0e0e0' : '',
                                                color: disableAnswers ? '#9e9e9e' : '',
                                                margin: '5px',
                                            }}
                                        >
                                            {option.option_text} ({optionCounters[option.id] || 0})
                                        </Button>
                                    ))}
                                    {answerFeedback.message && (
                                        <Typography
                                            style={{
                                                color: answerFeedback.isCorrect ? 'green' : 'red',
                                            }}
                                        >
                                            {answerFeedback.message}
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Box>
                <Typography variant="h5">Chat</Typography>
                <Box
                    sx={{
                        maxHeight: '300px',
                        maxWidth: '400px',
                        width: '100%',
                        overflowY: 'auto',
                        mt: 2,
                        mb: 2,
                        p: 2,
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        bgcolor: 'background.paper',
                    }}
                >
                    {/* Messages de chat */}
                    {chatMessages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.user === currentUser ? 'flex-start' : 'flex-end',
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: msg.user === currentUser ? '#e0f7fa' : '#fce4ec',
                                    color: msg.user === currentUser ? 'black' : 'darkgrey',
                                    p: 1,
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="caption" display="block" gutterBottom>
                                    {msg.user}
                                </Typography>
                                <Typography variant="body2">{msg.message}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: '400px',
                        width: '100%',
                        mt: 2,
                    }}
                    onSubmit={sendChatMessage}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Votre message"
                        variant="outlined"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        sx={{ mr: 1 }}
                    />
                    <Button variant="contained" type="submit">Envoyer</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Game;
