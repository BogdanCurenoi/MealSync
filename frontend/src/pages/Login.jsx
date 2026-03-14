import { Box, Container, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [form, setForm] = useState({ login_user: '', login_password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.login_user || !form.login_password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', form, { withCredentials: true });
            setUser(res.data);
            toast.success(`Welcome back, ${res.data.user_name}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFFDF7 60%, #FFF3C4 100%)',
            display: 'flex',
            alignItems: 'center'
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
                            Welcome back 👋
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                            Log in to your MealSync account
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Username"
                                name="login_user"
                                value={form.login_user}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                label="Password"
                                name="login_password"
                                type="password"
                                value={form.login_password}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                                fullWidth
                                sx={{ mt: 1 }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#E63946', fontWeight: 600, textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}
