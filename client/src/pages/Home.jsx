import React, { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import logo from '../assets/quiz_logo.png';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let decodedToken;

    if (token) {
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
        }
    }
    return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:"0", height: "90vh"}}>
                <img src={logo} alt="Quiz Logo" style={{ width: '100%', maxWidth: '400px' }} />
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
                    {decodedToken && decodedToken.role === 'ROLE_USER' && (
                        <Button variant="contained" color="primary" startIcon={<SearchOutlinedIcon />} onClick={() => navigate('/find-quizzes')}>
                            Trouvez un quiz
                        </Button>
                    )}

                    {decodedToken && decodedToken.role === 'ROLE_ADMIN' && (
                        <Button variant="contained" color="secondary" startIcon={<DrawOutlinedIcon />} onClick={() => navigate('/admin')}>
                            Créez un quiz
                        </Button>
                    )}
                </Box>
            </Box>
    );
    }

export default Home;