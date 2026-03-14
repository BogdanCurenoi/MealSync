import { Box, Container, Typography, Button, Divider, Card, CardContent, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PriceDisplay from '../components/PriceDisplay';
import { calculateDiscountedPrice } from '../utils/priceUtils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MenuDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/menus/${id}`).then(res => setMenu(res.data));
    }, [id]);

    const handleAddToCart = () => {
        if (!user) { navigate('/login'); return; }
        addToCart({
            menu_id: menu.id,
            name: menu.menu_name,
            price: calculateDiscountedPrice(menu.price, menu.discount),
            delivery_cost: menu.delivery_cost
        });
        toast.success(`${menu.menu_name} added to cart!`);
    };

    if (!menu) return null;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/menus')} sx={{ mb: 3, color: 'text.secondary' }}>
                    Back to Menus
                </Button>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F0EDE4', p: { xs: 3, md: 5 }, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{menu.menu_name}</Typography>
                            {menu.vegan_flag ? <Chip label="🌱 Vegan" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }} /> : null}
                        </Box>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.8 }}>{menu.description}</Typography>
                        <Divider sx={{ my: 3 }} />
                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Price</Typography>
                                <PriceDisplay price={menu.price} discount={menu.discount} size="large" />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Delivery</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{menu.delivery_cost} RON</Typography>
                            </Box>
                        </Box>
                        <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }} onClick={handleAddToCart}>
                            Add to Cart — {calculateDiscountedPrice(menu.price, menu.discount)} RON
                        </Button>
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Meals in this Menu</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {menu.meals.map((meal, i) => (
                            <motion.div key={meal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                                <Card onClick={() => navigate(`/meals/${meal.id}`)} sx={{
                                    borderRadius: '16px', border: '1px solid #F0EDE4', boxShadow: 'none', cursor: 'pointer',
                                    transition: 'all 0.3s', '&:hover': { boxShadow: '0 4px 20px rgba(230,57,70,0.1)', transform: 'translateX(4px)' }
                                }}>
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{meal.meal_name}</Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{meal.calories} kcal</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {meal.vegan_flag ? <Chip label="Vegan" size="small" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }} /> : null}
                                            <PriceDisplay price={meal.price} discount={meal.discount} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
