import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import UserProfile from './components/UserProfile';
import { mockUser } from './mockData/userData';
import AuthComponent from './components/LoginPage';
import HomePage from './components/HomePage';

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HomePage />
        </ThemeProvider>
    );
}

export default App; 