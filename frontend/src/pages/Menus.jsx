import { Box, Container, Typography, List, ListItemButton, ListItemText, Divider, Chip, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PriceDisplay from '../components/PriceDisplay';

export default function Menus() {
    const [data, setData] = useState({ menus: [], totalPages: 1 });
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/menus?page=${page}&limit=8`)
            .then(res => setData(res.data));
    }, [page]);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Menus</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Curated meal collections for every diet
                </Typography>

                <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0EDE4', overflow: 'hidden', mb: 4 }}>
                    <List disablePadding>
                        {data.menus.map((menu, i) => (
                            <motion.div key={menu.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                                <ListItemButton onClick={() => navigate(`/menus/${menu.id}`)} sx={{ px: 4, py: 2.5, '&:hover': { backgroundColor: '#FFFDF7' } }}>
                                    <ListItemText
                                        primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>{menu.menu_name}</Typography>}
                                        secondary={<Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{menu.description}</Typography>}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {menu.vegan_flag ? (
                                            <Chip label="Vegan" size="small" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }} />
                                        ) : null}
                                        <PriceDisplay price={menu.price} discount={menu.discount} />
                                        <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                                    </Box>
                                </ListItemButton>
                                {i < data.menus.length - 1 && <Divider />}
                            </motion.div>
                        ))}
                    </List>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
