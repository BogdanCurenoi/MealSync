import { Box, Container, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        login_user: '',
        login_password: '',
        confirm_password: '',
        user_name: '',
        user_surname: '',
        user_age: '',
        user_email: '',
        user_address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.login_user || !form.login_password || !form.user_name || !form.user_email) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (form.login_password !== form.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', form, { withCredentials: true });
            toast.success('Account created! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFFDF7 60%, #FFF3C4 100%)',
            display: 'flex',
            alignItems: 'center',
            py: 6
        }}>
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={0} sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: '24px',
                        border: '1px solid #F0EDE4',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center' }}>
                            Create an account 🍽️
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                            Join MealSync and start eating smarter
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                ACCOUNT DETAILS
                            </Typography>

                            <TextField label="Username *" name="login_user" value={form.login_user} onChange={handleChange} fullWidth sx={inputSx} />
                            <TextField label="Password *" name="login_password" type="password" value={form.login_password} onChange={handleChange} fullWidth sx={inputSx} />
                            <TextField label="Confirm Password *" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} fullWidth sx={inputSx} />

                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 1 }}>
                                PERSONAL DETAILS
                            </Typography>

                            <TextField label="First Name *" name="user_name" value={form.user_name} onChange={handleChange} fullWidth sx={inputSx} />
                            <TextField label="Last Name" name="user_surname" value={form.user_surname} onChange={handleChange} fullWidth sx={inputSx} />
                            <TextField label="Age" name="user_age" type="number" value={form.user_age} onChange={handleChange} fullWidth sx={inputSx} />
                            <TextField label="Email *" name="user_email" type="email" value={form.user_email} onChange={handleChange} fullWidth sx={inputSx} />
                            <TextField label="Address" name="user_address" value={form.user_address} onChange={handleChange} fullWidth sx={inputSx} />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                                fullWidth
                                sx={{ mt: 1 }}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#E63946', fontWeight: 600, textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}
