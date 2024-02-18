import { Box, Typography, Avatar } from "@mui/material";
import avatar from '../assets/avatar.jpg';


const Navbar = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', 
        justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <Typography variant="h6" component="h1" gutterBottom sx={{ color: '#FFF' }}>
                Bienvenue, Muthu !
            </Typography>
            <Avatar alt="Muthu" src={avatar} />
        </Box>
    );
}

export default Navbar;