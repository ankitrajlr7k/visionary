"use client";
import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ForgotResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRequestReset = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Reset email sent! Check your inbox.');
      setStep('reset'); // Show reset form after requesting reset
    } catch (error) {
      setError(error.response?.data || 'An error occurred');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('/api/auth/reset', { email, resetToken, newPassword });
      setMessage('Password updated successfully. You can now log in.');
      router.push('/login'); // Redirect to login page
    } catch (error) {
      setError(error.response?.data || 'An error occurred');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  return (
    <Container maxWidth="sm" className="mt-8">
      <Typography variant="h4" gutterBottom>
        {step === 'request' ? 'Forgot Password' : 'Reset Password'}
      </Typography>
      <Box component="form" onSubmit={step === 'request' ? handleRequestReset : handleResetPassword} className="space-y-4">
        {step === 'request' && (
          <>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {message && <Typography color="primary">{message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Send Reset Email
            </Button>
          </>
        )}
        {step === 'reset' && (
          <>
            <TextField
              fullWidth
              label="Reset Token"
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {message && <Typography color="primary">{message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Reset Password
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForgotResetPassword;
