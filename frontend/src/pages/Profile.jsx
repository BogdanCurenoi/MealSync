import { Box, Container, Typography, TextField, Button, Paper, Divider, Checkbox, FormControlLabel, Grid, Chip, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GrassIcon from '@mui/icons-material/Grass';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

const API = 'http://localhost:5000/api/user';
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };

const SectionCard = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '20px', border: '1px solid #F0EDE4', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ color: 'primary.main' }}>{icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
        </Box>
        {children}
    </Paper>
);

export default function Profile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({ user_name: '', user_surname: '', user_age: '', user_email: '', user_address: '' });
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [alergies, setAlergies] = useState({ all: [], selected: [] });
    const [diets, setDiets] = useState({ all: [], selected: [] });
    const [dietPage, setDietPage] = useState(1);
    const [orders, setOrders] = useState({ orders: [], totalPages: 1 });
    const [orderPage, setOrderPage] = useState(1);
    const [myCoupons, setMyCoupons] = useState([]);
    const [activeSub, setActiveSub] = useState(null);
    const [allMenus, setAllMenus] = useState([]);
    const [subMenus, setSubMenus] = useState([]);
    const [subMenuDialogOpen, setSubMenuDialogOpen] = useState(false);

    const dietsPerPage = 5;
    const paginatedDiets = diets.all.slice((dietPage - 1) * dietsPerPage, dietPage * dietsPerPage);
    const totalDietPages = Math.ceil(diets.all.length / dietsPerPage);

    useEffect(() => {
        axios.get(`${API}/profile`, { withCredentials: true }).then(res => setProfile(res.data));
        axios.get(`${API}/alergies`, { withCredentials: true }).then(res => setAlergies(res.data));
        axios.get(`${API}/diets`, { withCredentials: true }).then(res => setDiets(res.data));
        axios.get('http://localhost:5000/api/coupons/my', { withCredentials: true }).then(res => setMyCoupons(res.data));
        axios.get('http://localhost:5000/api/subscriptions/my', { withCredentials: true }).then(res => setActiveSub(res.data));
        axios.get('http://localhost:5000/api/menus?limit=100').then(res => setAllMenus(res.data.menus));
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/orders/my?page=${orderPage}`, { withCredentials: true })
            .then(res => setOrders(res.data));
    }, [orderPage]);

    const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const saveProfile = async () => {
        try {
            await axios.put(`${API}/profile`, profile, { withCredentials: true });
            setUser(prev => ({ ...prev, user_name: profile.user_name }));
            toast.success('Profile updated');
        } catch {
            toast.error('Failed to update profile');
        }
    };

    const savePassword = async () => {
        if (!passwords.current_password || !passwords.new_password) return toast.error('Fill in all password fields');
        if (passwords.new_password !== passwords.confirm_password) return toast.error('New passwords do not match');
        try {
            await axios.put(`${API}/change-password`, passwords, { withCredentials: true });
            toast.success('Password changed');
            setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        }
    };

    const toggleAlergie = (id) => {
        setAlergies(prev => ({
            ...prev,
            selected: prev.selected.includes(id) ? prev.selected.filter(a => a !== id) : [...prev.selected, id]
        }));
    };

    const saveAlergies = async () => {
        try {
            await axios.put(`${API}/alergies`, { alergy_ids: alergies.selected }, { withCredentials: true });
            toast.success('Alergies updated');
        } catch {
            toast.error('Failed to update alergies');
        }
    };

    const toggleDiet = (id) => {
        setDiets(prev => ({
            ...prev,
            selected: prev.selected.includes(id) ? prev.selected.filter(d => d !== id) : [...prev.selected, id]
        }));
    };

    const saveDiets = async () => {
        try {
            await axios.put(`${API}/diets`, { diet_ids: diets.selected }, { withCredentials: true });
            toast.success('Diet preferences updated');
        } catch {
            toast.error('Failed to update diets');
        }
    };

    const handleCancelSub = async () => {
        try {
            await axios.put('http://localhost:5000/api/subscriptions/cancel', {}, { withCredentials: true });
            toast.success('Subscription cancelled');
            setActiveSub(null);
        } catch {
            toast.error('Failed to cancel subscription');
        }
    };

    const handleUpdateSubMenus = async () => {
        try {
            await axios.put('http://localhost:5000/api/subscriptions/menus', { menu_ids: subMenus.filter(Boolean) }, { withCredentials: true });
            toast.success('Daily menus updated');
            setSubMenuDialogOpen(false);
            const res = await axios.get('http://localhost:5000/api/subscriptions/my', { withCredentials: true });
            setActiveSub(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update menus');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFDF7', py: 6 }}>
            <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>My Profile</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage your account details and preferences</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1,
                            backgroundColor: '#FFF3C4', border: '1px solid #FFC60A',
                            borderRadius: '50px', px: 2.5, py: 1
                        }}>
                            <LoyaltyIcon sx={{ color: '#B8860B', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#B8860B' }}>
                                {user?.loyalty_points || 0} Loyalty Points
                            </Typography>
                        </Box>
                    </Box>

                    <SectionCard title="Personal Details" icon={<PersonIcon />}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="First Name" name="user_name" value={profile.user_name || ''} onChange={handleProfileChange} fullWidth sx={inputSx} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Last Name" name="user_surname" value={profile.user_surname || ''} onChange={handleProfileChange} fullWidth sx={inputSx} />
                                </Grid>
                            </Grid>
                            <TextField label="Age" name="user_age" type="number" value={profile.user_age || ''} onChange={handleProfileChange} fullWidth sx={inputSx} />
                            <TextField label="Email" name="user_email" type="email" value={profile.user_email || ''} onChange={handleProfileChange} fullWidth sx={inputSx} />
                            <TextField label="Address" name="user_address" value={profile.user_address || ''} onChange={handleProfileChange} fullWidth sx={inputSx} />
                            <Button variant="contained" color="primary" onClick={saveProfile} sx={{ alignSelf: 'flex-start' }}>
                                Save Changes
                            </Button>
                        </Box>
                    </SectionCard>

                    <SectionCard title="Change Password" icon={<LockIcon />}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField label="Current Password" name="current_password" type="password" value={passwords.current_password} onChange={handlePasswordChange} fullWidth sx={inputSx} />
                            <TextField label="New Password" name="new_password" type="password" value={passwords.new_password} onChange={handlePasswordChange} fullWidth sx={inputSx} />
                            <TextField label="Confirm New Password" name="confirm_password" type="password" value={passwords.confirm_password} onChange={handlePasswordChange} fullWidth sx={inputSx} />
                            <Button variant="contained" color="primary" onClick={savePassword} sx={{ alignSelf: 'flex-start' }}>
                                Change Password
                            </Button>
                        </Box>
                    </SectionCard>

                    <SectionCard title="My Alergies" icon={<RestaurantMenuIcon />}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                            {alergies.all.map(a => (
                                <Chip
                                    key={a.id}
                                    label={a.alergy_name}
                                    onClick={() => toggleAlergie(a.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        backgroundColor: alergies.selected.includes(a.id) ? '#E63946' : '#F5F5F5',
                                        color: alergies.selected.includes(a.id) ? '#FFFFFF' : 'text.primary',
                                        border: alergies.selected.includes(a.id) ? '2px solid #E63946' : '2px solid transparent',
                                        '&:hover': { backgroundColor: alergies.selected.includes(a.id) ? '#c1121f' : '#EEEEEE' }
                                    }}
                                />
                            ))}
                        </Box>
                        <Button variant="contained" color="primary" onClick={saveAlergies}>
                            Save Alergies
                        </Button>
                    </SectionCard>

                    <SectionCard title="Diet Preferences" icon={<GrassIcon />}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                            {paginatedDiets.map(d => (
                                <FormControlLabel
                                    key={d.id}
                                    control={
                                        <Checkbox
                                            checked={diets.selected.includes(d.id)}
                                            onChange={() => toggleDiet(d.id)}
                                            sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{d.diet_name}</Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{d.description}</Typography>
                                        </Box>
                                    }
                                />
                            ))}
                        </Box>
                        {totalDietPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Pagination
                                    count={totalDietPages}
                                    page={dietPage}
                                    onChange={(_, val) => setDietPage(val)}
                                    color="primary"
                                    shape="rounded"
                                    size="small"
                                />
                            </Box>
                        )}
                        <Button variant="contained" color="primary" onClick={saveDiets}>
                            Save Preferences
                        </Button>
                    </SectionCard>

                    <SectionCard title="My Coupons" icon={<LocalOfferIcon />}>
                        {myCoupons.length === 0 ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>No active coupons.</Typography>
                                <Button variant="outlined" color="primary" size="small" onClick={() => navigate('/coupons')}>Get Coupons</Button>
                            </Box>
                        ) : (
                            <Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                    {myCoupons.map(c => (
                                        <Box key={c.id} sx={{ border: '2px dashed #E63946', borderRadius: '12px', px: 2, py: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#E63946' }}>{c.coupon_name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Expires {new Date(c.expires_at).toLocaleDateString('ro-RO')}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Button variant="outlined" color="primary" size="small" onClick={() => navigate('/coupons')}>Get More Coupons</Button>
                            </Box>
                        )}
                    </SectionCard>

                    <SectionCard title="My Subscription" icon={<SubscriptionsIcon />}>
                        {!activeSub ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>No active subscription.</Typography>
                                <Button variant="outlined" color="primary" size="small" onClick={() => navigate('/subscriptions')}>View Plans</Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{activeSub.type_name}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {activeSub.duration_months} month{activeSub.duration_months > 1 ? 's' : ''} plan
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Active until {new Date(activeSub.end_date).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Total paid: {parseFloat(activeSub.total_paid).toFixed(2)} RON
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <Chip
                                            label={`${activeSub.daily_loyalty_points} pts/day`}
                                            sx={{ backgroundColor: '#FFF3C4', color: '#B8860B', fontWeight: 600 }}
                                        />
                                        <Chip
                                            label={activeSub.delivery_discount === 100 ? 'Free Delivery' : `${activeSub.delivery_discount}% off delivery`}
                                            sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}
                                        />
                                    </Box>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Daily Menus</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                                        {activeSub.menus.map(m => (
                                            <Chip key={m.id} label={m.menu_name} sx={{ backgroundColor: '#F5F5F5', fontWeight: 600 }} />
                                        ))}
                                    </Box>
                                    <Button size="small" variant="outlined" color="primary"
                                        onClick={() => { setSubMenus(activeSub.menus.map(m => m.id)); setSubMenuDialogOpen(true); }}>
                                        Change Daily Menus
                                    </Button>
                                </Box>

                                <Button variant="outlined" color="error" size="small" sx={{ alignSelf: 'flex-start' }} onClick={handleCancelSub}>
                                    Cancel Subscription
                                </Button>
                            </Box>
                        )}
                    </SectionCard>

                    <SectionCard title="Order History" icon={<ReceiptLongIcon />}>
                        {orders.orders.length === 0 ? (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>You have no orders yet.</Typography>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                    {orders.orders.map(order => (
                                        <Box key={order.id} sx={{ border: '1px solid #F0EDE4', borderRadius: '12px', p: 2.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Order #{order.id}</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {new Date(order.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>
                                                        {(parseFloat(order.total_price) + parseFloat(order.delivery_cost)).toFixed(2)} RON
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ mb: 1.5 }} />
                                            {order.items.map(item => (
                                                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                                    <Typography variant="body2">{item.meal_name || item.menu_name} × {item.quantity}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{(item.item_price * item.quantity).toFixed(2)} RON</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    ))}
                                </Box>
                                {orders.totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Pagination
                                            count={orders.totalPages}
                                            page={orderPage}
                                            onChange={(_, val) => setOrderPage(val)}
                                            color="primary"
                                            shape="rounded"
                                            size="small"
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </SectionCard>

                </motion.div>
            </Container>

            <Dialog open={subMenuDialogOpen} onClose={() => setSubMenuDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Change Daily Menus</DialogTitle>
                <DialogContent>
                    {activeSub && Array.from({ length: activeSub.max_daily_menus }).map((_, i) => (
                        <FormControl key={i} fullWidth sx={{ mb: 2, mt: i === 0 ? 1 : 0, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                            <InputLabel>Menu {activeSub.max_daily_menus > 1 ? i + 1 : ''}</InputLabel>
                            <Select
                                value={subMenus[i] || ''}
                                label={`Menu ${activeSub.max_daily_menus > 1 ? i + 1 : ''}`}
                                onChange={(e) => {
                                    const updated = [...subMenus];
                                    updated[i] = e.target.value;
                                    setSubMenus(updated);
                                }}
                            >
                                {allMenus.map(m => (
                                    <MenuItem key={m.id} value={m.id}
                                        disabled={subMenus.includes(m.id) && subMenus[i] !== m.id}>
                                        {m.menu_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setSubMenuDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleUpdateSubMenus} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
