import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const token = localStorage.getItem('token');
    let userRole = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.role;
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
        }
    }

   

    const isAuthorized = token && (!requiredRoles || requiredRoles.includes(userRole));

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;