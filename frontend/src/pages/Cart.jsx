import { Box, Container, Typography, Button, Divider, IconButton, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
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
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [myCoupons, setMyCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState('');
    const [activeSub, setActiveSub] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/coupons/my', { withCredentials: true })
            .then(res => setMyCoupons(res.data));
        axios.get('http://localhost:5000/api/subscriptions/my', { withCredentials: true })
            .then(res => setActiveSub(res.data));
    }, []);

    const getKey = (item) => item.meal_id ? `meal_${item.meal_id}` : `menu_${item.menu_id}`;
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const rawDeliveryCost = cart.reduce((sum, i) => sum + i.delivery_cost, 0);
    const deliveryDiscount = activeSub ? activeSub.delivery_discount : 0;
    const deliveryCost = deliveryDiscount === 100
        ? 0
        : +(rawDeliveryCost * (1 - deliveryDiscount / 100)).toFixed(2);

    const activeCoupon = myCoupons.find(c => c.id === selectedCoupon);
    const discountAmount = activeCoupon ? +(subtotal * activeCoupon.discount_percent / 100).toFixed(2) : 0;
    const discountedSubtotal = +(subtotal - discountAmount).toFixed(2);
    const total = +(discountedSubtotal + deliveryCost).toFixed(2);
    const pointsToEarn = Math.floor(total / 10);

    const handleOrder = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/orders',
                { items: cart, user_coupon_id: selectedCoupon || null },
                { withCredentials: true }
            );
            clearCart();
            setUser(prev => ({ ...prev, loyalty_points: (prev.loyalty_points || 0) + res.data.points_earned }));
            toast.success(`Order placed! You earned ${res.data.points_earned} loyalty points.`);
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
                                            {item.price} RON each
                                            {deliveryDiscount === 100
                                                ? ' · Free Delivery'
                                                : deliveryDiscount > 0
                                                    ? ` · Delivery: ${+(item.delivery_cost * (1 - deliveryDiscount / 100)).toFixed(2)} RON (-${deliveryDiscount}%)`
                                                    : ` · Delivery: ${item.delivery_cost} RON`
                                            }
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

                    <Box sx={{ width: { xs: '100%', md: '340px' } }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #F0EDE4', position: 'sticky', top: 90 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>

                            {activeSub && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#F3E5F5', borderRadius: '12px', p: 1.5, mb: 2 }}>
                                    <LocalShippingIcon sx={{ color: '#6A0DAD', fontSize: 18 }} />
                                    <Typography variant="body2" sx={{ color: '#6A0DAD', fontWeight: 600 }}>
                                        {deliveryDiscount === 100
                                            ? `${activeSub.type_name}: Free delivery applied`
                                            : `${activeSub.type_name}: ${deliveryDiscount}% off delivery applied`}
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Subtotal</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{subtotal.toFixed(2)} RON</Typography>
                            </Box>

                            {activeCoupon && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="body2" sx={{ color: '#2E7D32' }}>Coupon (-{activeCoupon.discount_percent}%)</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32' }}>-{discountAmount.toFixed(2)} RON</Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Delivery
                                    {deliveryDiscount > 0 && rawDeliveryCost > 0 && (
                                        <Typography component="span" variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled', ml: 1 }}>
                                            {rawDeliveryCost.toFixed(2)} RON
                                        </Typography>
                                    )}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: deliveryDiscount === 100 ? '#2E7D32' : 'inherit' }}>
                                    {deliveryDiscount === 100 ? 'Free' : `${deliveryCost.toFixed(2)} RON`}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{total.toFixed(2)} RON</Typography>
                            </Box>

                            {myCoupons.length > 0 && (
                                <FormControl fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                                    <InputLabel>Apply Coupon</InputLabel>
                                    <Select
                                        value={selectedCoupon}
                                        label="Apply Coupon"
                                        onChange={(e) => setSelectedCoupon(e.target.value)}
                                    >
                                        <MenuItem value=''>None</MenuItem>
                                        {myCoupons.map(c => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.coupon_name} (expires {new Date(c.expires_at).toLocaleDateString('ro-RO')})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#FFF3C4', borderRadius: '12px', p: 1.5, mb: 3 }}>
                                <LoyaltyIcon sx={{ color: '#B8860B', fontSize: 18 }} />
                                <Typography variant="body2" sx={{ color: '#B8860B', fontWeight: 600 }}>
                                    You'll earn {pointsToEarn} loyalty point{pointsToEarn !== 1 ? 's' : ''} on this order
                                </Typography>
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
