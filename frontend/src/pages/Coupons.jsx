import { Box, Container, Typography, Paper, Button, Chip, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function Coupons() {
    const { user, setUser } = useAuth();
    const [couponTypes, setCouponTypes] = useState([]);
    const [myCoupons, setMyCoupons] = useState([]);

    const fetchData = () => {
        axios.get('http://localhost:5000/api/coupons/types').then(res => setCouponTypes(res.data));
        axios.get('http://localhost:5000/api/coupons/my', { withCredentials: true }).then(res => setMyCoupons(res.data));
    };

    useEffect(() => { fetchData(); }, []);

    const handleBuy = async (coupon) => {
        if ((user?.loyalty_points || 0) < coupon.loyalty_cost) {
            toast.error(`You need ${coupon.loyalty_cost} points. You have ${user?.loyalty_points || 0}.`);
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/coupons/buy', { coupon_type_id: coupon.id }, { withCredentials: true });
            setUser(prev => ({ ...prev, loyalty_points: res.data.loyalty_points }));
            toast.success('Coupon purchased!');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to purchase coupon');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Coupon Shop</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Redeem your loyalty points for discounts</Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        backgroundColor: '#FFF3C4', border: '1px solid #FFC60A',
                        borderRadius: '50px', px: 2.5, py: 1
                    }}>
                        <LoyaltyIcon sx={{ color: '#B8860B', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#B8860B' }}>
                            {user?.loyalty_points || 0} Points
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Available Coupons</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
                    {couponTypes.map((coupon, i) => (
                        <motion.div key={coupon.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                            <Paper elevation={0} sx={{
                                p: 3, borderRadius: '16px', border: '1px solid #F0EDE4',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ backgroundColor: '#FFEBEE', borderRadius: '12px', p: 1.5 }}>
                                        <LocalOfferIcon sx={{ color: '#E63946', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{coupon.coupon_name}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Valid for 30 days after purchase
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Cost</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LoyaltyIcon sx={{ color: '#B8860B', fontSize: 16 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#B8860B' }}>{coupon.loyalty_cost}</Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={(user?.loyalty_points || 0) < coupon.loyalty_cost}
                                        onClick={() => handleBuy(coupon)}
                                    >
                                        Redeem
                                    </Button>
                                </Box>
                            </Paper>
                        </motion.div>
                    ))}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>My Coupons</Typography>
                {myCoupons.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>You have no active coupons.</Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {myCoupons.map((coupon, i) => (
                            <motion.div key={coupon.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                                <Paper elevation={0} sx={{
                                    p: 3, borderRadius: '16px',
                                    border: '2px dashed #E63946',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2
                                }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#E63946' }}>{coupon.coupon_name}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Expires: {new Date(coupon.expires_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </Box>
                                    <Chip label={`-${coupon.discount_percent}%`} sx={{ backgroundColor: '#E63946', color: '#FFFFFF', fontWeight: 700, fontSize: '1rem', px: 1 }} />
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
