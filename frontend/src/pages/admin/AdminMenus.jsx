import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, Chip, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const emptyMenu = { menu_name: '', description: '', price: '', discount: 0, delivery_cost: '', vegan_flag: false, meal_ids: [] };
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };
const PER_PAGE = 5;

export default function AdminMenus() {
    const [menus, setMenus] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyMenu);
    const [page, setPage] = useState(1);

    const fetch = () => axios.get('http://localhost:5000/api/admin/menus', { withCredentials: true }).then(res => setMenus(res.data));
    useEffect(() => {
        fetch();
        axios.get('http://localhost:5000/api/admin/meals', { withCredentials: true }).then(res => setAllMeals(res.data));
    }, []);

    const openCreate = () => { setEditing(null); setForm(emptyMenu); setDialogOpen(true); };
    const openEdit = (menu) => {
        setEditing(menu);
        setForm({ menu_name: menu.menu_name, description: menu.description, price: menu.price, discount: menu.discount || 0, delivery_cost: menu.delivery_cost, vegan_flag: !!menu.vegan_flag, meal_ids: menu.meals.map(m => m.id) });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://localhost:5000/api/admin/menus/${editing.id}`, form, { withCredentials: true });
                toast.success('Menu updated');
            } else {
                await axios.post('http://localhost:5000/api/admin/menus', form, { withCredentials: true });
                toast.success('Menu created');
            }
            setDialogOpen(false);
            fetch();
        } catch {
            toast.error('Failed to save menu');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/menus/${id}`, { withCredentials: true });
            toast.success('Menu deleted');
            fetch();
        } catch {
            toast.error('Failed to delete menu');
        }
    };

    const pageCount = Math.ceil(menus.length / PER_PAGE);
    const paginated = menus.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Menus</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreate}>Add Menu</Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F0EDE4' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Delivery</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Vegan</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Meals</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map(m => (
                            <TableRow key={m.id} hover>
                                <TableCell>{m.menu_name}</TableCell>
                                <TableCell>{m.price} RON</TableCell>
                                <TableCell>{m.discount}%</TableCell>
                                <TableCell>{m.delivery_cost} RON</TableCell>
                                <TableCell>{m.vegan_flag ? '✅' : '❌'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {m.meals.map(meal => <Chip key={meal.id} label={meal.meal_name} size="small" />)}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => openEdit(m)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(m.id)} sx={{ color: '#E63946' }}><DeleteOutlineIcon /></IconButton>
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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Name" value={form.menu_name} onChange={e => setForm({ ...form, menu_name: e.target.value })} fullWidth sx={inputSx} />
                    <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} sx={inputSx} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Price (RON)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} fullWidth sx={inputSx} />
                        <TextField label="Discount (%)" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} fullWidth sx={inputSx} />
                    </Box>
                    <TextField label="Delivery Cost (RON)" type="number" value={form.delivery_cost} onChange={e => setForm({ ...form, delivery_cost: e.target.value })} fullWidth sx={inputSx} />
                    <FormControlLabel
                        control={<Checkbox checked={form.vegan_flag} onChange={e => setForm({ ...form, vegan_flag: e.target.checked })} />}
                        label="Vegan"
                    />
                    <FormControl fullWidth>
                        <InputLabel>Meals in this Menu</InputLabel>
                        <Select
                            multiple
                            value={form.meal_ids}
                            onChange={e => setForm({ ...form, meal_ids: e.target.value })}
                            input={<OutlinedInput label="Meals in this Menu" sx={{ borderRadius: '12px' }} />}
                            renderValue={selected => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(id => {
                                        const meal = allMeals.find(m => m.id === id);
                                        return meal ? <Chip key={id} label={meal.meal_name} size="small" /> : null;
                                    })}
                                </Box>
                            )}
                        >
                            {allMeals.map(m => <MenuItem key={m.id} value={m.id}>{m.meal_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}
