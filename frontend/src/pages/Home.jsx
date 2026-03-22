import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const features = [
    { icon: <LocalDiningIcon sx={{ fontSize: 36, color: '#E63946' }} />, title: 'Chef-crafted Meals', desc: 'Every meal is designed by nutrition experts and prepared fresh daily.' },
    { icon: <DeliveryDiningIcon sx={{ fontSize: 36, color: '#E63946' }} />, title: 'Fast Delivery', desc: 'Hot and fresh meals delivered straight to your door on time.' },
    { icon: <FavoriteBorderIcon sx={{ fontSize: 36, color: '#E63946' }} />, title: 'Diet Friendly', desc: 'Vegan, low-carb, high-protein — we have a plan for every lifestyle.' }
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{
                minHeight: '92vh',
                background: 'linear-gradient(135deg, #FFFDF7 55%, #FFF3C4 100%)',
                display: 'flex',
                alignItems: 'center',
            }}>
                <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 6,
                    }}>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ maxWidth: 540 }}
                        >
                            <Box sx={{
                                display: 'inline-block',
                                backgroundColor: '#FFF3C4',
                                border: '1px solid #FFC60A',
                                borderRadius: '50px',
                                px: 2, py: 0.5, mb: 3
                            }}>
                                <Typography variant="body2" sx={{ color: '#B8860B', fontWeight: 600 }}>
                                    🥗 Healthy eating made simple
                                </Typography>
                            </Box>

                            <Typography variant="h2" sx={{ color: 'text.primary', lineHeight: 1.2, mb: 2 }}>
                                Eat Smart,<br />
                                <span style={{ color: '#E63946' }}>Live Better</span>
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                Fresh diet meals delivered to your door, every single day.
                                Choose your plan and let us handle the rest.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/meals')}>
                                    Order Now
                                </Button>
                                <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/subscriptions')}>
                                    View Plans
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 4, mt: 5, flexWrap: 'wrap' }}>
                                {[['500+', 'Happy Clients'], ['30+', 'Diet Plans'], ['100%', 'Fresh Ingredients']].map(([val, label]) => (
                                    <Box key={label}>
                                        <Typography variant="h5" sx={{ color: '#E63946', fontWeight: 700 }}>{val}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, #FFC60A44, #E6394622)',
                                    transform: 'translate(12px, 12px)',
                                    zIndex: 0
                                }} />
                                <Box
                                    component="img"
                                    src="/home_logo.jpg"
                                    alt="Healthy food"
                                    sx={{
                                        position: 'relative',
                                        zIndex: 1,
                                        width: { xs: '100%', md: '580px' },
                                        height: { xs: 'auto', md: '420px' },
                                        objectFit: 'cover',
                                        borderRadius: '24px',
                                        boxShadow: '0 24px 64px rgba(230,57,70,0.18)'
                                    }}
                                />
                            </Box>
                        </motion.div>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, backgroundColor: '#FFFFFF' }}>
                <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
                        Why Choose <span style={{ color: '#E63946' }}>NutriBloom?</span>
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
                        We make healthy eating effortless
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {features.map((f, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    viewport={{ once: true }}
                                >
                                    <Box sx={{
                                        p: 4,
                                        borderRadius: '20px',
                                        backgroundColor: '#FFFDF7',
                                        border: '1px solid #F0EDE4',
                                        textAlign: 'center',
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': { boxShadow: '0 8px 32px rgba(230,57,70,0.12)' }
                                    }}>
                                        <Box sx={{ mb: 2 }}>{f.icon}</Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{f.desc}</Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Banner */}
            <Box sx={{
                py: 8,
                background: 'linear-gradient(135deg, #E63946, #c1121f)',
                textAlign: 'center'
            }}>
                <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
                            Ready to start your journey?
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFE8EA', mb: 4 }}>
                            Subscribe today and get your first week at a discounted price.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/subscriptions')}
                            sx={{
                                backgroundColor: '#FFC60A',
                                color: '#1A1A2E',
                                '&:hover': { backgroundColor: '#e6b200' }
                            }}
                        >
                            Get Started
                        </Button>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
}
