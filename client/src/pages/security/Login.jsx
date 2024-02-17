import { useNavigate } from 'react-router-dom';
import logo from '../../assets/quiz_logo.png';
import { Box, Container, Typography, Paper, TextField, Button, Link} from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: "0" }}>
                <img src={logo} alt="Quiz Logo" style={{ width: '100%', maxWidth: '400px' }} />
                <Paper elevation={3} sx={{ padding: '1em', width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
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
                    <Link variant="body2" sx={{ textAlign: 'center', cursor: 'pointer', marginTop: '1em' }} onClick={() => navigate('/forgot-password')}>
                        Mot de passe oublié ?
                    </Link>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '1em' }}>
                        <Button variant="contained" color="primary">
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