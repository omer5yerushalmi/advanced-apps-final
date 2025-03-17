import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <GoogleOAuthProvider clientId=''>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
); 