import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const Game = () => {
    const { roomId, quizId } = useParams();
    const socketRef = useRef(null);
    const [question, setQuestion] = useState(null);

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
            socketRef.current.emit('nextQuestion', roomId, quizId, 0);
        });

        socketRef.current.on('nextQuestion', (receivedQuizId, receivedQuestion) => {
            if (receivedQuizId === quizId) {
                setQuestion(receivedQuestion);
            }
        });

        return () => {
            console.log('Disconnected from server');
            socketRef.current.disconnect();
        };
    }, [roomId, quizId]);

    const handleOptionClick = (selectedOption) => {
        const token = localStorage.getItem('token');

        const decoded = jwtDecode(token);
        const decodedUser = { login: decoded.login, id: decoded.id };
        console.log('Option selected:', selectedOption);
        socketRef.current.emit('answerQuestion', roomId, quizId, question.id, decodedUser.id, selectedOption.id);
    };

    return (
        <Box>
            <Typography variant="h3">Game</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Box p={2}>
                            {question && (
                                <>
                                    <Typography variant="h4">Question: {question.text}</Typography>
                                    <Typography variant="h5">Options:</Typography>
                                    {question.options.map(option => (
                                        <Button key={option.id} onClick={() => handleOptionClick(option)}>
                                            {option.option_text}
                                        </Button>
                                    ))}
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
