import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';

// Custom icon components instead of using lucide-react
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

interface FormData {
  email: string;
  password: string;
  name: string;
}

const AuthComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login clicked');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #6366f1, #a855f7, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)' }}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
        </Box>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!isLogin && (
              <TextField
                fullWidth
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            
            <TextField
              fullWidth
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                bgcolor: '#9333ea', 
                '&:hover': { bgcolor: '#7e22ce' },
                py: 1
              }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', my: 1 }}>
              <Divider sx={{ width: '100%' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  position: 'absolute', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  bgcolor: 'background.paper', 
                  px: 1,
                  color: 'text.secondary'
                }}
              >
                OR
              </Typography>
            </Box>

            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              sx={{ 
                borderColor: 'rgba(107, 114, 128, 0.5)', 
                py: 1,
                '&:hover': { bgcolor: 'rgba(243, 244, 246, 0.5)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                  <Typography component="span" sx={{ color: '#3b82f6' }}>G</Typography>
                  <Typography component="span" sx={{ color: '#ef4444' }}>o</Typography>
                  <Typography component="span" sx={{ color: '#f59e0b' }}>o</Typography>
                  <Typography component="span" sx={{ color: '#3b82f6' }}>g</Typography>
                  <Typography component="span" sx={{ color: '#22c55e' }}>l</Typography>
                  <Typography component="span" sx={{ color: '#ef4444' }}>e</Typography>
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: '#9333ea' } 
                  }}
                >
                  Continue with Google
                </Typography>
              </Box>
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'inline' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Typography>
              <Button
                sx={{ 
                  color: '#9333ea', 
                  p: 0, 
                  minWidth: 'auto', 
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } 
                }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthComponent;