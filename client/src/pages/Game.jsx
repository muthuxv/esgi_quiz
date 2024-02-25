import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
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
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3001');
        }

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            socketRef.current.emit('nextQuestion', roomId, quizId, count);
        });

        socketRef.current.on('timer', (timeLeft) => {
            setTimer(timeLeft);
        });
    
        socketRef.current.on('nextQuestion', (receivedQuizId, receivedQuestion, receivedCount) => {
            if (receivedQuizId === quizId) {
                setQuestion(receivedQuestion);
                setAnswerFeedback('');
                setDisableAnswers(false);
                setCount(receivedCount);
                setTimer(30);
            }
        });
        

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

        socketRef.current.on('quizEnded', (receivedRoomId, receivedQuizId) => {
            if (receivedRoomId === roomId && receivedQuizId === quizId) {
                navigate(`/results/${roomId}/${quizId}`);
            }
        });

        return () => {
            socketRef.current.off('updateOptionCounter');
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
            const response = await fetch(`http://localhost:3001/responses`, {
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

     return (
        <Box>
            <Typography variant="h3">Game</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Box p={2}>
                            <Typography variant="h5">Time left: {timer} seconds</Typography>
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
        </Box>
    );
};

export default Game;
