import { Box, Container, Typography, Paper, Button, Chip, Divider, ToggleButton, ToggleButtonGroup, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DURATION_LABELS = { 1: '1 Month', 3: '3 Months', 6: '6 Months', 12: '12 Months' };
const DURATION_SAVINGS = { 1: null, 3: '-10%', 6: '-15%', 12: '-25%' };

export default function Subscriptions() {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [menus, setMenus] = useState([]);
    const [activeSub, setActiveSub] = useState(null);
    const [duration, setDuration] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedMenus, setSelectedMenus] = useState([]);

    useEffect(() => {
        axios.get('/api/subscriptions/plans').then(res => setPlans(res.data));
        axios.get('/api/menus?limit=100').then(res => setMenus(res.data.menus));
        axios.get('/api/subscriptions/my', { withCredentials: true }).then(res => setActiveSub(res.data));
    }, []);

    const premiumPlans = plans.filter(p => p.type_name === 'Premium');
    const platinumPlans = plans.filter(p => p.type_name === 'Platinum');

    const getPlanByDuration = (planList, dur) => planList.find(p => p.duration_months === dur);
    const getMonthlyPrice = (plan) => +(plan.price_per_month * (1 - plan.discount_percent / 100)).toFixed(2);
    const getTotalPrice = (plan) => +(getMonthlyPrice(plan) * plan.duration_months).toFixed(2);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setSelectedMenus([]);
        setDialogOpen(true);
    };

    const handleSubscribe = async () => {
        const filled = selectedMenus.filter(Boolean);
        if (filled.length !== selectedPlan.max_daily_menus) {
            toast.error(`Please select ${selectedPlan.max_daily_menus} menu(s)`);
            return;
        }
        try {
            await axios.post('/api/subscriptions',
                { plan_id: selectedPlan.id, menu_ids: filled },
                { withCredentials: true }
            );
            toast.success('Subscription activated!');
            setDialogOpen(false);
            const res = await axios.get('/api/subscriptions/my', { withCredentials: true });
            setActiveSub(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to subscribe');
        }
    };

    const PlanCard = ({ planType, planList, color, features }) => {
        const plan = getPlanByDuration(planList, duration);
        if (!plan) return null;
        return (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ flex: 1, minWidth: 280 }}>
                <Paper elevation={0} sx={{
                    p: 4, borderRadius: '24px', height: '100%',
                    border: `2px solid ${color}`,
                    boxShadow: `0 8px 40px ${color}22`,
                    display: 'flex', flexDirection: 'column', gap: 2
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color }}>{planType}</Typography>
                        {DURATION_SAVINGS[duration] && (
                            <Chip label={DURATION_SAVINGS[duration]} size="small"
                                sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />
                        )}
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color }}>{getMonthlyPrice(plan)} RON</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>/month</Typography>
                        </Box>
                        {duration > 1 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Total: {getTotalPrice(plan)} RON · was {+(plan.price_per_month * plan.duration_months).toFixed(2)} RON
                            </Typography>
                        )}
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                        {features.map((f, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CheckCircleIcon sx={{ color, fontSize: 20, flexShrink: 0 }} />
                                <Typography variant="body2">{f}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!!activeSub}
                        onClick={() => handleSelectPlan(plan)}
                        sx={{ mt: 'auto', backgroundColor: color, '&:hover': { backgroundColor: color, filter: 'brightness(0.9)' }, '&.Mui-disabled': { backgroundColor: '#E0E0E0' } }}
                    >
                        {activeSub ? 'Already Subscribed' : `Get ${planType}`}
                    </Button>
                </Paper>
            </motion.div>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Subscription Plans</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                        Fresh menus delivered to you every day. Save more with longer plans.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ToggleButtonGroup
                            value={duration}
                            exclusive
                            onChange={(_, val) => val && setDuration(val)}
                            sx={{ backgroundColor: '#FFFFFF', border: '1px solid #F0EDE4', borderRadius: '50px', p: 0.5 }}
                        >
                            {[1, 3, 6, 12].map(d => (
                                <ToggleButton key={d} value={d} sx={{ borderRadius: '50px !important', border: 'none', px: 3, fontWeight: 600 }}>
                                    {DURATION_LABELS[d]}
                                    {DURATION_SAVINGS[d] && (
                                        <Chip label={DURATION_SAVINGS[d]} size="small"
                                            sx={{ ml: 1, backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
                                    )}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <PlanCard
                        planType="Premium"
                        planList={premiumPlans}
                        color="#E63946"
                        features={[
                            '1 menu delivered every day',
                            'Change your daily menu anytime',
                            '10 loyalty points per day',
                            '50% off delivery on extra orders'
                        ]}
                    />
                    <PlanCard
                        planType="Platinum"
                        planList={platinumPlans}
                        color="#6A0DAD"
                        features={[
                            '3 menus delivered every day',
                            'Change your daily menus anytime',
                            '25 loyalty points per day',
                            'Free delivery on all extra orders'
                        ]}
                    />
                </Box>
            </Container>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Choose Your Daily Menu{selectedPlan?.max_daily_menus > 1 ? 's' : ''}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Select {selectedPlan?.max_daily_menus} menu{selectedPlan?.max_daily_menus > 1 ? 's' : ''} to be delivered daily. You can change these anytime from your profile.
                    </Typography>
                    {Array.from({ length: selectedPlan?.max_daily_menus || 1 }).map((_, i) => (
                        <FormControl key={i} fullWidth sx={{ mb: 2, mt: i === 0 ? 1 : 0, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                            <InputLabel>Menu {selectedPlan?.max_daily_menus > 1 ? i + 1 : ''}</InputLabel>
                            <Select
                                value={selectedMenus[i] || ''}
                                label={`Menu ${selectedPlan?.max_daily_menus > 1 ? i + 1 : ''}`}
                                onChange={(e) => {
                                    const updated = [...selectedMenus];
                                    updated[i] = e.target.value;
                                    setSelectedMenus(updated);
                                }}
                            >
                                {menus.map(m => (
                                    <MenuItem key={m.id} value={m.id}
                                        disabled={selectedMenus.includes(m.id) && selectedMenus[i] !== m.id}>
                                        {m.menu_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleSubscribe} variant="contained" color="primary">Confirm Subscription</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
