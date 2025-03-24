import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import AuthComponent from './components/LoginPage';
import HomePage from './components/HomePage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from './config/api';


const theme = createTheme();

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Check if access token exists in localStorage
        const token = localStorage.getItem('accessToken');
        const storedEmail = localStorage.getItem('userEmail');
        const storedUsername = localStorage.getItem('username');
        setIsAuthenticated(!!token);
        if (storedEmail) 
            setUserEmail(storedEmail);
        if (storedUsername)
            setUsername(storedUsername);

    }, []);

    const handleLogout = async () => {
        console.log('User logged out');
        try {
            await axios.post(`${API_CONFIG.baseURL}/api/auth/logout`, { "userEmail": userEmail }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            localStorage.clear();
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error with logout', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated ? (
            <HomePage userEmail={userEmail} username={username} onLogoutClick={handleLogout}/>
        ) : (
            <AuthComponent setIsAuthenticated={setIsAuthenticated} setUserEmail={setUserEmail} setUsername={setUsername}/>
        )}
        </ThemeProvider>
    );
}

export default App; 