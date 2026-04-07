import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, TextField, InputAdornment, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../context/AuthContext';

const PER_PAGE = 5;

export default function AdminUsers() {
    const { user: me } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetch = () => axios.get('/api/admin/users', { withCredentials: true }).then(res => setUsers(res.data));
    useEffect(() => { fetch(); }, []);

    const handleDelete = async (id) => {
        if (id === me.id) return toast.error("You can't delete yourself");
        try {
            await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
            toast.success('User deleted');
            fetch();
        } catch {
            toast.error('Failed to delete user');
        }
    };

    const filtered = users.filter(u =>
        u.login_user.toLowerCase().includes(search.toLowerCase()) ||
        u.user_email?.toLowerCase().includes(search.toLowerCase())
    );
    const pageCount = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Users</Typography>
                <TextField
                    placeholder="Search users..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>, sx: { borderRadius: '12px' } }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F0EDE4' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Points</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map(u => (
                            <TableRow key={u.id} hover>
                                <TableCell>{u.id}</TableCell>
                                <TableCell>{u.login_user}</TableCell>
                                <TableCell>{u.user_name} {u.user_surname}</TableCell>
                                <TableCell>{u.user_email}</TableCell>
                                <TableCell>{u.user_address}</TableCell>
                                <TableCell>{u.loyalty_points}</TableCell>
                                <TableCell><Chip label={u.role_name} size="small" /></TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDelete(u.id)} sx={{ color: '#E63946' }}><DeleteOutlineIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                </Box>
            )}
        </AdminLayout>
    );
}
