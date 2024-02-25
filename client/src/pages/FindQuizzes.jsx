import React, { useEffect, useState } from "react";
import { Typography, Button, Grid, Box} from "@mui/material";
import QuizzesTable from "../components/QuizzesTable";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import QuizForm from "../components/forms/QuizForm";
import { jwtDecode } from 'jwt-decode';

const FindQuizzes = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [quizzes, setQuizzes] = useState([]);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://195.35.29.110:3001/quizzes');
            const data = await response.json();
            setQuizzes(data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const handleCreate = async (quizData) => {
        try {
            // Step 1: Create the quiz
            const quizResponse = await fetch('http://195.35.29.110:3001/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: quizData.title,
                    description: quizData.description,
                    user_id: jwtDecode(localStorage.getItem('token')).id,
                })
            });
            const quizDataResponse = await quizResponse.json();
            console.log('Quiz created successfully:', quizDataResponse);
    
            // Step 2: Add questions
            for (const question of quizData.questions) {
                const questionResponse = await fetch('http://195.35.29.110:3001/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: question.text,
                        type: question.type,
                        quiz_id: quizDataResponse.id,
                    })
                });
                const questionDataResponse = await questionResponse.json();
                console.log('Question added successfully:', questionDataResponse);
    
                // Step 3: Add options for each question
                for (const option of question.options) {
                    const optionResponse = await fetch('http://195.35.29.110:3001/options', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            option_text: option.text,
                            isCorrect: option.correct,
                            question_id: questionDataResponse.id,
                        })
                    });
                    const optionDataResponse = await optionResponse.json();
                    console.log('Option added successfully:', optionDataResponse);
                }
            }

            handleClose();
            fetchQuizzes();
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };
    

    const handleDelete = async (id) => {
        try {
            await fetch(`http://195.35.29.110:3001/quizzes/${id}`, {
                method: 'DELETE',
            });

            fetchQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleRedirectToQuizz = async (id) => {
        navigate(`/quiz-manage/${id}`);
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: "1em" }} >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: "100%", gap: "30%"}}>
                <Button variant="contained" color="primary" sx={{ marginTop: '1em', boxShadow: 4 }} onClick={() => navigate('/')} startIcon={<ArrowBackIosNewOutlinedIcon />}>
                    Retour à l'accueil
                </Button>
                <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#FFF', marginTop: '1em' }}>
                    Liste des quiz
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <QuizzesTable quizzes={quizzes}/>
                </Grid>
            </Grid>
            {open && <QuizForm open={open} handleClose={handleClose} handleCreate={handleCreate} />}
        </Box>

    );
}

export default FindQuizzes;