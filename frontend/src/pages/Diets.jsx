import { Box, Container, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Diets() {
    const [diets, setDiets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/diets').then(res => setDiets(res.data));
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Diet Plans</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Full diet programs built from our curated menus
                </Typography>

                <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0EDE4', overflow: 'hidden' }}>
                    <List disablePadding>
                        {diets.map((diet, i) => (
                            <motion.div key={diet.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                                <ListItemButton onClick={() => navigate(`/diets/${diet.id}`)} sx={{ px: 4, py: 2.5, '&:hover': { backgroundColor: '#FFFDF7' } }}>
                                    <ListItemText
                                        primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>{diet.diet_name}</Typography>}
                                        secondary={<Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{diet.description}</Typography>}
                                    />
                                    <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                                </ListItemButton>
                                {i < diets.length - 1 && <Divider />}
                            </motion.div>
                        ))}
                    </List>
                </Box>
            </Container>
        </Box>
    );
}
