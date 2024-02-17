import React, { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import logo from '../assets/quiz_logo.png';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:"0", height: "90vh"}}>
                <img src={logo} alt="Quiz Logo" style={{ width: '100%', maxWidth: '400px' }} />
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
                    <Button variant="contained" color="primary" startIcon={<SearchOutlinedIcon />}>
                        Trouvez un quiz
                    </Button>
                    {/* Pour admin */}
                    <Button variant="contained" color="secondary" startIcon={<DrawOutlinedIcon />} onClick={() => navigate('/admin')}>
                        Créez un quiz
                    </Button>
                </Box>
            </Box>
    );
    }

export default Home;