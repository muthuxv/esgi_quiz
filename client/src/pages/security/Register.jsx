import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Link, Paper, TextField } from '@mui/material';
import logo from '../../assets/quiz_logo.png';

const Register = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, email, password }),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Erreur d’inscription');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion à l’API', error);
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: "0" }}>
                <img src={logo} alt="Quiz Logo" style={{ width: '100%', maxWidth: '400px' }} />
                <Paper elevation={3} sx={{ padding: '1em', width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <form onSubmit={handleRegister}>
                        <TextField
                            label="Login"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Mot de passe"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '1em' }}>
                            <Button type="submit" variant="contained" color="primary">
                                S'inscrire
                            </Button>
                            <Link variant="body2" onClick={() => navigate('/login')} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                                Déjà un compte ? Se connecter
                            </Link>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default Register;
