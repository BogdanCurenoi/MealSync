import { Box, Container, Typography, Button, Divider, IconButton, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const getKey = (item) => item.meal_id ? `meal_${item.meal_id}` : `menu_${item.menu_id}`;
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryCost = cart.reduce((sum, i) => sum + i.delivery_cost, 0);
    const total = subtotal + deliveryCost;

    const handleOrder = async () => {
        try {
            await axios.post('http://localhost:5000/api/orders', { items: cart }, { withCredentials: true });
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/');
        } catch {
            toast.error('Failed to place order');
        }
    };

    if (cart.length === 0) return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
                <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: '#E0E0E0', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Your cart is empty</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Add some meals or menus to get started</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/meals')}>Browse Meals</Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Your Cart</Typography>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        {cart.map((item, i) => (
                            <motion.div
                                key={getKey(item)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                            >
                                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #F0EDE4', mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    {item.image_url && (
                                        <Box
                                            component="img"
                                            src={`http://localhost:5000${item.image_url}`}
                                            alt={item.name}
                                            sx={{ width: 70, height: 70, borderRadius: '12px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {item.price} RON each · Delivery: {item.delivery_cost} RON
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton size="small" onClick={() => updateQuantity(getKey(item), item.quantity - 1)}
                                            sx={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="body1" sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                                            {item.quantity}
                                        </Typography>
                                        <IconButton size="small" onClick={() => updateQuantity(getKey(item), item.quantity + 1)}
                                            sx={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', minWidth: 80, textAlign: 'right' }}>
                                        {(item.price * item.quantity).toFixed(2)} RON
                                    </Typography>
                                    <IconButton onClick={() => removeFromCart(getKey(item))} sx={{ color: '#E63946' }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '320px' } }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #F0EDE4', position: 'sticky', top: 90 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Subtotal</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{subtotal.toFixed(2)} RON</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Delivery</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{deliveryCost.toFixed(2)} RON</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{total.toFixed(2)} RON</Typography>
                            </Box>
                            <Button variant="contained" color="primary" size="large" fullWidth onClick={handleOrder}>
                                Place Order
                            </Button>
                            <Button variant="text" color="inherit" fullWidth sx={{ mt: 1, color: 'text.secondary' }} onClick={() => navigate('/meals')}>
                                Continue Shopping
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
