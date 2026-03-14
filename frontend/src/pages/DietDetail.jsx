import { Box, Container, Typography, Button, Divider, List, ListItemButton, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function DietDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [diet, setDiet] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/diets/${id}`).then(res => setDiet(res.data));
    }, [id]);

    if (!diet) return null;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/diets')} sx={{ mb: 3, color: 'text.secondary' }}>
                    Back to Diets
                </Button>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F0EDE4', p: { xs: 3, md: 5 }, mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{diet.diet_name}</Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.8 }}>{diet.description}</Typography>
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Available Menus</Typography>
                    <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0EDE4', overflow: 'hidden' }}>
                        <List disablePadding>
                            {diet.menus.map((menu, i) => (
                                <motion.div key={menu.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                                    <ListItemButton onClick={() => navigate(`/menus/${menu.id}`)} sx={{ px: 4, py: 2.5, '&:hover': { backgroundColor: '#FFFDF7' } }}>
                                        <ListItemText
                                            primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>{menu.menu_name}</Typography>}
                                            secondary={<Typography variant="body2" sx={{ color: 'text.secondary' }}>{menu.description}</Typography>}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{menu.price} RON</Typography>
                                            <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                                        </Box>
                                    </ListItemButton>
                                    {i < diet.menus.length - 1 && <Divider />}
                                </motion.div>
                            ))}
                        </List>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
