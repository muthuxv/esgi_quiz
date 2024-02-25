import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/quiz_logo.png';
import { Box, Container, Typography, Paper, TextField, Button, Link, Alert} from '@mui/material';
import {jwtDecode} from 'jwt-decode';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const Login = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
        try {
            const response = await fetch('http://195.35.29.110:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                const decoded = jwtDecode(data.token);
                console.log(decoded);
                navigate('/');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error);
        }
    }

    function handlePassWordVisibility() {
        setShowPassword(!showPassword);
    }


    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: "0" }}>
                <img src={logo} alt="Quiz Logo" style={{ width: '100%', maxWidth: '400px' }} />
                <Paper elevation={3} sx={{ padding: '1em', width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Login"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <TextField
                        label="Mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: <VisibilityOutlinedIcon onClick={() => handlePassWordVisibility()} sx={{ cursor: 'pointer' }} />
                        }}
                    />
                    <Link variant="body2" sx={{ textAlign: 'center', cursor: 'pointer', marginTop: '1em' }} onClick={() => navigate('/forgot-password')}>
                        Mot de passe oublié ?
                    </Link>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '1em' }}>
                        <Button variant="contained" color="primary" onClick={() => handleLogin()}>
                            Se connecter
                        </Button>
                        <Link variant="body2" onClick={() => navigate('/register')} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                            Pas de compte ? S'inscrire
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login;