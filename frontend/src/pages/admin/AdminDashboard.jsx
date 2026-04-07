import { Box, Typography, Paper, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EuroIcon from '@mui/icons-material/Euro';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #F0EDE4', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ backgroundColor: color + '22', borderRadius: '12px', p: 1.5 }}>
            <Box sx={{ color }}>{icon}</Box>
        </Box>
        <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
        </Box>
    </Paper>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/stats', { withCredentials: true }).then(res => setStats(res.data));
    }, []);

    if (!stats) return <AdminLayout><Typography>Loading...</Typography></AdminLayout>;

    return (
        <AdminLayout>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Dashboard</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value={stats.total_users} icon={<PeopleIcon />} color="#E63946" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Orders" value={stats.total_orders} icon={<ReceiptIcon />} color="#2196F3" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Revenue" value={`${parseFloat(stats.total_revenue).toFixed(2)} RON`} icon={<EuroIcon />} color="#4CAF50" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Subscriptions" value={stats.active_subs} icon={<SubscriptionsIcon />} color="#6A0DAD" />
                </Grid>
            </Grid>
        </AdminLayout>
    );
}
