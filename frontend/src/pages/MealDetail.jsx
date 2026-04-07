import { Box, Container, Typography, Chip, Button, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PriceDisplay from '../components/PriceDisplay';
import { calculateDiscountedPrice } from '../utils/priceUtils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MealDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        axios.get(`/api/meals/${id}`).then(res => setMeal(res.data));
    }, [id]);

    const handleAddToCart = () => {
        if (!user) { navigate('/login'); return; }
        addToCart({
            meal_id: meal.id,
            name: meal.meal_name,
            image_url: meal.image_url,
            price: calculateDiscountedPrice(meal.price, meal.discount),
            delivery_cost: meal.delivery_cost
        });
        toast.success(`${meal.meal_name} added to cart!`);
    };

    if (!meal) return null;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/meals')} sx={{ mb: 3, color: 'text.secondary' }}>
                    Back to Meals
                </Button>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box sx={{
                        backgroundColor: '#FFFFFF', borderRadius: '24px',
                        border: '1px solid #F0EDE4', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', overflow: 'hidden'
                    }}>
                        <Box
                            component="img"
                            src={`${meal.image_url}`}
                            alt={meal.meal_name}
                            sx={{ width: '100%', height: '360px', objectFit: 'cover' }}
                        />
                        <Box sx={{ p: { xs: 3, md: 5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{meal.meal_name}</Typography>
                                {meal.vegan_flag ? (
                                    <Chip label="🌱 Vegan" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }} />
                                ) : (
                                    <Chip label="🍗 Non-Vegan" sx={{ backgroundColor: '#FFF3E0', color: '#E65100', fontWeight: 600 }} />
                                )}
                            </Box>

                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.8 }}>
                                {meal.description}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Calories</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{meal.calories} kcal</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Price</Typography>
                                    <PriceDisplay price={meal.price} discount={meal.discount} size="large" />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Delivery</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{meal.delivery_cost} RON</Typography>
                                </Box>
                            </Box>

                            {meal.alergies && meal.alergies.length > 0 && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <WarningAmberIcon sx={{ color: '#E65100', fontSize: 20 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#E65100' }}>
                                                Alergen Warning
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {meal.alergies.map(a => (
                                                <Chip
                                                    key={a.id}
                                                    label={a.alergy_name}
                                                    sx={{ backgroundColor: '#FFF3E0', color: '#E65100', fontWeight: 600, border: '1px solid #FFCC80' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </>
                            )}

                            <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }} onClick={handleAddToCart}>
                                Add to Cart — {calculateDiscountedPrice(meal.price, meal.discount)} RON
                            </Button>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
