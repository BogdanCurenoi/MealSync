import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Badge } from '@mui/material';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { cartCount } = useCart();

    return (
        <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0EDE4', zIndex: 1200 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Typography
                        variant="h5"
                        onClick={() => navigate('/')}
                        sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 700 }}
                    >
                        Nutri<span style={{ color: '#FFC60A' }}>Bloom</span>
                    </Typography>
                </motion.div>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/')}>Home</Button>
                    <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/meals')}>Meals</Button>
                    <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/menus')}>Menus</Button>
                    <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/diets')}>Diets</Button>
                    <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/subscriptions')}>Subscriptions</Button>
                    <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/coupons')}>Coupons</Button>

                    {user?.role_permission === 99 && (
                        <Button sx={{ color: 'error.main', fontWeight: 700 }} onClick={() => navigate('/admin')}>Admin</Button>
                    )}

                    <IconButton onClick={() => navigate('/cart')} sx={{ color: 'text.primary' }}>
                        <Badge badgeContent={cartCount} color="primary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button onClick={() => navigate('/profile')} sx={{ color: 'text.secondary', textTransform: 'none' }} startIcon={<AccountCircleIcon />}>
                                {user.user_name}
                            </Button>
                            <Button variant="outlined" color="primary" onClick={logout}>Logout</Button>
                        </Box>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                            <PersonIcon sx={{ mr: 0.5, fontSize: 18 }} /> Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
