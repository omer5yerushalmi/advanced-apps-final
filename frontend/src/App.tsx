    import { ThemeProvider, CssBaseline } from '@mui/material';
    import { createTheme } from '@mui/material/styles';
    import AuthComponent from './components/LoginPage';
    import HomePage from './components/HomePage';
    import { useState, useEffect } from 'react';
import axios from 'axios';


    const theme = createTheme();

    function App() {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
        useEffect(() => {
            // Check if access token exists in localStorage
            const token = localStorage.getItem('accessToken');
            setIsAuthenticated(!!token);
        }, []);

        const handleLogout = async () => {
            console.log('User logged out');
            try {        
                await axios.post('http://localhost:3010/api/auth/logout', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
                <HomePage onLogout={handleLogout}/>
            ) : (
                <AuthComponent setIsAuthenticated={setIsAuthenticated} />
            )}
            </ThemeProvider>
        );
    }

    export default App; 