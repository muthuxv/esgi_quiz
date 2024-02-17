import { Typography, Button, Grid, Box , Paper} from "@mui/material";
import QuizTable from "../components/QuizTable";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const AdminBoard = () => {
    const navigate = useNavigate();

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
                        <QuizTable />
                        <Button variant="contained" color="secondary" sx={{ marginTop: '1em', boxShadow: '4' }} startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => navigate('/admin/create')}>
                            Créer un nouveau quiz
                        </Button>
                </Grid>
            </Grid>
        </Box>

    );
}

export default AdminBoard;