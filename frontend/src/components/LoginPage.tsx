import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { GoogleLogin, CredentialResponse} from '@react-oauth/google';
import { register, googleSignin, IUser, login} from '../services/user-services'


interface FormData {
  email: string;
  password: string;
  username: string;
}

interface AuthProps {
  setIsAuthenticated: (auth: boolean) => void;
  setUserEmail: (email: string) => void;
}

const AuthComponent: React.FC<AuthProps> = ({ setIsAuthenticated, setUserEmail  }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);

    if (isLogin) {
      console.log("handle login")
      try {
        const user: IUser = {
          email: formData?.email,
          password: formData?.password
        }
        const res = await login(user)
        console.log(res)
        if (res?.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('userEmail', formData.email);
          setUserEmail(formData.email);
          setIsAuthenticated(true);
        }
      } catch(e){
        console.log(e)
      }
    } else {
      console.log("handle register")
      try {
        const user: IUser = {
          email: formData?.email,
          password: formData?.password,
          username: formData?.username
        }
        const res = await register(user)
        console.log(res)
        setIsLogin(true)
      } catch (e) {
        console.log(e)
      }
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse)
    try {
      const res = await googleSignin(credentialResponse)
      console.log(res)
      if (res?.accessToken && res?.email) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('userEmail', res.email);
        setUserEmail(res.email);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onGoogleLoginError = () => {
    console.log("Google login failed")
  }

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
      <Card sx={{ width: '100%', maxWidth: 400, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
        </Box>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
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
              color="primary"
              sx={{ py: 1 }}
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
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GoogleLogin logo_alignment='center' onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
            </div>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'inline' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Typography>
              <Button
                color="primary"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ textTransform: 'none' }}
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