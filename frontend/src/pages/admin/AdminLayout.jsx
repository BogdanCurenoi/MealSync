import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GrassIcon from '@mui/icons-material/Grass';
import ReceiptIcon from '@mui/icons-material/Receipt';

const DRAWER_WIDTH = 240;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Meals', icon: <RestaurantIcon />, path: '/admin/meals' },
    { label: 'Menus', icon: <MenuBookIcon />, path: '/admin/menus' },
    { label: 'Diets', icon: <GrassIcon />, path: '/admin/diets' },
    { label: 'Orders', icon: <ReceiptIcon />, path: '/admin/orders' },
];

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFDF7' }}>
            <Drawer variant="permanent" sx={{
                width: DRAWER_WIDTH, flexShrink: 0,
                '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', backgroundColor: '#1A1A2E', color: '#FFFFFF', pt: '70px' }
            }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem' }}>
                        Admin Panel
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: '#ffffff22' }} />
                <List>
                    {navItems.map(item => (
                        <ListItemButton
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                mx: 1, borderRadius: '10px', mb: 0.5,
                                '&.Mui-selected': { backgroundColor: '#E63946', '&:hover': { backgroundColor: '#c1121f' } },
                                '&:hover': { backgroundColor: '#ffffff11' }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 36 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box sx={{ flex: 1, p: 4, ml: `${DRAWER_WIDTH}px` }}>
                {children}
            </Box>
        </Box>
    );
}
