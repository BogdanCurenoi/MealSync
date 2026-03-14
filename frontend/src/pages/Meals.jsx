import { Box, Container, Typography, Pagination, Chip, Card, CardMedia, CardContent,
    TextField, Checkbox, FormControlLabel, Button, Divider, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';
import TuneIcon from '@mui/icons-material/Tune';

const defaultFilters = { min_price: '', max_price: '', min_calories: '', max_calories: '', has_discount: false, vegan: false };
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };

export default function Meals() {
    const { user } = useAuth();
    const [data, setData] = useState({ meals: [], totalPages: 1 });
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 8);
        if (appliedFilters.min_price) params.append('min_price', appliedFilters.min_price);
        if (appliedFilters.max_price) params.append('max_price', appliedFilters.max_price);
        if (appliedFilters.min_calories) params.append('min_calories', appliedFilters.min_calories);
        if (appliedFilters.max_calories) params.append('max_calories', appliedFilters.max_calories);
        if (appliedFilters.has_discount) params.append('has_discount', 'true');
        if (appliedFilters.vegan) params.append('vegan', 'true');
        if (user?.id) params.append('user_id', user.id);

        axios.get(`http://localhost:5000/api/meals?${params.toString()}`)
            .then(res => setData(res.data));
    }, [page, appliedFilters, user]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const applyFilters = () => { setAppliedFilters(filters); setPage(1); };
    const resetFilters = () => { setFilters(defaultFilters); setAppliedFilters(defaultFilters); setPage(1); };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Our Meals</Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Fresh, nutritious meals crafted for your diet goals
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<TuneIcon />}
                        onClick={() => setShowFilters(prev => !prev)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Box>

                <Collapse in={showFilters}>
                    <Box sx={{
                        backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0EDE4',
                        p: 3, mb: 4, display: 'flex', flexDirection: 'column', gap: 2.5
                    }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField label="Min Price (RON)" name="min_price" type="number" value={filters.min_price} onChange={handleFilterChange} sx={{ ...inputSx, flex: 1, minWidth: 150 }} />
                            <TextField label="Max Price (RON)" name="max_price" type="number" value={filters.max_price} onChange={handleFilterChange} sx={{ ...inputSx, flex: 1, minWidth: 150 }} />
                            <TextField label="Min Calories" name="min_calories" type="number" value={filters.min_calories} onChange={handleFilterChange} sx={{ ...inputSx, flex: 1, minWidth: 150 }} />
                            <TextField label="Max Calories" name="max_calories" type="number" value={filters.max_calories} onChange={handleFilterChange} sx={{ ...inputSx, flex: 1, minWidth: 150 }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <FormControlLabel
                                control={<Checkbox name="has_discount" checked={filters.has_discount} onChange={handleFilterChange} sx={{ '&.Mui-checked': { color: 'primary.main' } }} />}
                                label="On Sale"
                            />
                            <FormControlLabel
                                control={<Checkbox name="vegan" checked={filters.vegan} onChange={handleFilterChange} sx={{ '&.Mui-checked': { color: 'primary.main' } }} />}
                                label="Vegan Only"
                            />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="primary" onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outlined" color="primary" onClick={resetFilters}>Reset</Button>
                        </Box>
                    </Box>
                </Collapse>

                {user && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            🛡️ Meals containing your registered alergies are automatically hidden.
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {data.meals.map((meal, i) => (
                        <Box
                            key={meal.id}
                            sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }, minWidth: 0 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                style={{ height: '100%' }}
                            >
                                <Card onClick={() => navigate(`/meals/${meal.id}`)} sx={{
                                    borderRadius: '20px', cursor: 'pointer', border: '1px solid #F0EDE4',
                                    boxShadow: 'none', height: '100%', transition: 'all 0.3s',
                                    '&:hover': { boxShadow: '0 8px 32px rgba(230,57,70,0.12)', transform: 'translateY(-4px)' }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:5000${meal.image_url}`}
                                        alt={meal.meal_name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{meal.meal_name}</Typography>
                                            {meal.vegan_flag ? (
                                                <Chip label="Vegan" size="small" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }} />
                                            ) : null}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                            {meal.calories} kcal
                                        </Typography>
                                        <PriceDisplay price={meal.price} discount={meal.discount} />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    ))}
                </Box>

                {data.meals.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>No meals found matching your filters.</Typography>
                        <Button variant="outlined" color="primary" onClick={resetFilters} sx={{ mt: 2 }}>Reset Filters</Button>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                        count={data.totalPages}
                        page={page}
                        onChange={(_, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            </Container>
        </Box>
    );
}
