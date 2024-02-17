import { Box, Typography, Avatar } from "@mui/material";


const Navbar = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', 
        justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <Typography variant="h6" component="h1" gutterBottom sx={{ color: '#FFF' }}>
                Bienvenue, muthuxv!
            </Typography>
            <Avatar alt="Muthu" src="https://avatars.githubusercontent.com/u/1315101?v=4" />
        </Box>
    );
}

export default Navbar;