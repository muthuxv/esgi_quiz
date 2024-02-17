import { useNavigate } from 'react-router-dom';
import logo from '../../assets/quiz_logo.png';
import { Box, Button, Container, Link, Paper, TextField } from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: "0" }}>
                    <img src={logo} alt="Quiz Logo" style={{ width: '100%', maxWidth: '400px' }} />
                <Paper elevation={3} sx={{ padding: '1em', width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <TextField
                        id="outlined-basic"
                        label="Login"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="outlined-basic"
                        label="Mot de passe"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '1em' }}>
                        <Button variant="contained" color="primary">
                            S'inscrire
                        </Button>
                        <Link variant="body2" onClick={() => navigate('/login')} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                            Déjà un compte ? Se connecter
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Register;