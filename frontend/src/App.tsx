import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import AuthComponent from './components/LoginPage';
import HomePage from './components/HomePage';
import { useState, useEffect } from 'react';


const theme = createTheme();

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Check if access token exists in localStorage
        const token = localStorage.getItem('accessToken');
        const storedEmail = localStorage.getItem('userEmail');
        setIsAuthenticated(!!token);
        if (storedEmail) 
            setUserEmail(storedEmail);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated ? (
            <HomePage userEmail={userEmail}/>
        ) : (
            <AuthComponent setIsAuthenticated={setIsAuthenticated} setUserEmail={setUserEmail}/>
        )}
        </ThemeProvider>
    );
}

export default App; 