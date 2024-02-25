import React, { useEffect, useState } from 'react';
//mui
import { Box, Typography, Grid, Paper, Button, Alert, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const Result = () => {
    const { roomId, quizId } = useParams();
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [ranking, setRanking] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const fetchQuizCorrectAnswers = async () => {
            try {
                const response = await fetch(`http://195.35.29.110:3001/quizzes/${quizId}`);
                const data = await response.json();
                setCorrectAnswers(data);
                console.log('Correct answers:', data);
            }
            catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        const fetchUserAnswers = async () => {
            try {
                const response = await fetch(`http://195.35.29.110:3001/responses?room_id=${roomId}&user_id=${userId}`);
                const data = await response.json();
                setUserAnswers(data);
                console.log('User answers:', data);
            }
            catch (error) {
                console.error('Error fetching user answers:', error);
            }
        };

        const fetchRanking = async () => {
            try {
                const response = await fetch(`http://195.35.29.110:3001/responses?room_id=${roomId}`);
                const data = await response.json(); 
                console.log('Ranking:', data);
                setRanking(data);
            }
            catch (error) {
                console.error('Error fetching ranking:', error);
            }
        };

        fetchQuizCorrectAnswers();
        fetchUserAnswers();
        fetchRanking();
    }, [quizId, roomId]);


    const handleReturn = () => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        try {
            fetch(`http://195.35.29.110:3001/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    room_id: null,
                })
            });
        }
        catch (error) {
            console.error('Error updating user:', error);
        }
        navigate(`/`);
    };



    return (
        <Container>
            <Typography variant="h4" sx={{ my: 2, color: 'white' }}>Résultats</Typography>
            <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => handleReturn()}>Retour</Button>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2, width: '100%', height: '100%', overflow: 'auto' }}>
                        <Typography variant="caption">Réponses correctes du quiz </Typography>
                        {correctAnswers.questions && correctAnswers.questions.map((question, index) => (
                            <Box key={question.id}>
                                <Typography variant="h8" sx={{ mb: 2 }}>Question {index + 1}</Typography>
                                <Alert>{question.options.find(option => option.isCorrect).option_text}</Alert>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2, width: '100%', height: '100%', overflow: 'auto' }}>
                        <Typography variant="caption">Vos réponses</Typography>
                        {correctAnswers.questions && correctAnswers.questions.map((question, index) => (
                            <Box key={question.id}>
                                <Typography variant="h8" sx={{ mb: 2 }}>Question {index + 1}</Typography>
                                {userAnswers.find(answer => answer.question_id === question.id && answer.isCorrect) ? (
                                    <Alert severity="success">Correct</Alert>
                                ) : (
                                    <Alert severity="error">Incorrect</Alert>
                                )}
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2, width: '100%', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption">Score</Typography>
                        <Typography variant="h2" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                            {userAnswers.filter(answer => answer.isCorrect).length} / {correctAnswers.questions && correctAnswers.questions.length}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
    }
export default Result;