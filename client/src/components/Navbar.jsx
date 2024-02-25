import { Box, Typography, Avatar, AppBar, Button, Link, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import avatar from '../assets/avatar.jpg';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react'; 

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let decodedToken;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    if (token) {
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
        }
    }

    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToRegister = () => {
        navigate('/register');
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        handleClose();
        navigate('/login');
    };

    return (
        /*
        <Box sx={{ display: 'flex', flexDirection: 'row', 
        justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <Typography variant="h6" component="h1" gutterBottom sx={{ color: '#FFF' }}>
                Bienvenue, Muthu !
            </Typography>
            <Avatar alt="Muthu" src={avatar} />
        </Box>
        */
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
            <Toolbar>
                <Link href="/" underline="none" color="inherit" sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                        Quiz App
                    </Typography>
                </Link>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1em' }}>
                    <ul style={{ listStyleType: 'none', display: 'flex', gap: '1em', alignItems: 'center' }}>
                        {!decodedToken ? (
                            <>
                               <li><Button onClick={redirectToLogin}>Connexion</Button></li>
                                <li><Button onClick={redirectToRegister}>S'inscrire</Button></li>
                            </>
                        ) : (
                            <>
                                {decodedToken.role === 'ROLE_ADMIN' && (
                                    <li>Admin</li>
                                )}
                                {decodedToken.role === 'ROLE_USER' && (
                                    <li>Utilisateur</li>
                                )}
                                <li>
                                    <IconButton onClick={handleMenu} size="large" sx={{ p: 0 }}>
                                        <Avatar alt="Muthu" src={avatar} />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                                    </Menu>
                                </li>
                            </>
                        )}
                    </ul>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;