import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, FormControlLabel, Checkbox, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const API = 'http://localhost:5000/api/admin';
const emptyMeal = { meal_name: '', description: '', calories: '', price: '', discount: '0', delivery_cost: '', vegan_flag: false, alergy_ids: [] };
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };
const PER_PAGE = 5;

export default function AdminMeals() {
    const [meals, setMeals] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyMeal);
    const [imageFile, setImageFile] = useState(null);
    const [page, setPage] = useState(1);

    const load = () => Promise.all([
        axios.get(`${API}/meals`, { withCredentials: true }),
        axios.get(`${API}/allergies`, { withCredentials: true })
    ]).then(([m, a]) => { setMeals(m.data); setAllergies(a.data); });

    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm(emptyMeal); setImageFile(null); setDialogOpen(true); };

    const openEdit = (meal) => {
        setEditing(meal);
        setForm({
            meal_name: meal.meal_name || '',
            description: meal.description || '',
            calories: meal.calories || '',
            price: meal.price || '',
            discount: meal.discount || '0',
            delivery_cost: meal.delivery_cost || '',
            vegan_flag: meal.vegan_flag === 1 || meal.vegan_flag === true,
            alergy_ids: meal.alergies ? meal.alergies.map(a => a.id) : []
        });
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            data.append('meal_name', form.meal_name);
            data.append('description', form.description);
            data.append('calories', form.calories);
            data.append('price', form.price);
            data.append('discount', form.discount || 0);
            data.append('delivery_cost', form.delivery_cost);
            data.append('vegan_flag', form.vegan_flag ? 1 : 0);
            data.append('alergy_ids', JSON.stringify(form.alergy_ids));
            if (imageFile) data.append('image', imageFile);
            if (editing) data.append('existing_image', editing.image_url || '');

            if (editing) {
                await axios.put(`${API}/meals/${editing.id}`, data, { withCredentials: true });
                toast.success('Meal updated');
            } else {
                await axios.post(`${API}/meals`, data, { withCredentials: true });
                toast.success('Meal created');
            }
            setDialogOpen(false);
            load();
        } catch {
            toast.error('Failed to save meal');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/meals/${id}`, { withCredentials: true });
            toast.success('Meal deleted');
            load();
        } catch {
            toast.error('Failed to delete meal');
        }
    };

    const pageCount = Math.ceil(meals.length / PER_PAGE);
    const paginated = meals.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Meals</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreate}>Add Meal</Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F0EDE4' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Calories</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Delivery</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Vegan</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Allergies</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map(m => (
                            <TableRow key={m.id} hover>
                                <TableCell>{m.id}</TableCell>
                                <TableCell>{m.meal_name}</TableCell>
                                <TableCell>{m.calories}</TableCell>
                                <TableCell>{m.price} RON</TableCell>
                                <TableCell>{m.discount}%</TableCell>
                                <TableCell>{m.delivery_cost} RON</TableCell>
                                <TableCell>{m.vegan_flag ? '✅' : '—'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {m.alergies && m.alergies.length > 0
                                            ? m.alergies.map(a => <Chip key={a.id} label={a.alergy_name} size="small" color="warning" />)
                                            : <Typography variant="body2" color="text.secondary">—</Typography>
                                        }
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
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Meal' : 'Add Meal'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Name" value={form.meal_name} onChange={e => setForm({ ...form, meal_name: e.target.value })} fullWidth sx={inputSx} />
                    <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} sx={inputSx} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Calories" type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} fullWidth sx={inputSx} />
                        <TextField label="Price (RON)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} fullWidth sx={inputSx} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Discount (%)" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} fullWidth sx={inputSx} />
                        <TextField label="Delivery Cost (RON)" type="number" value={form.delivery_cost} onChange={e => setForm({ ...form, delivery_cost: e.target.value })} fullWidth sx={inputSx} />
                    </Box>
                    <FormControlLabel
                        control={<Checkbox checked={form.vegan_flag} onChange={e => setForm({ ...form, vegan_flag: e.target.checked })} color="primary" />}
                        label="Vegan"
                    />
                    <FormControl fullWidth>
                        <InputLabel>Allergies</InputLabel>
                        <Select
                            multiple
                            value={form.alergy_ids}
                            onChange={e => setForm({ ...form, alergy_ids: e.target.value })}
                            input={<OutlinedInput label="Allergies" sx={{ borderRadius: '12px' }} />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(id => {
                                        const a = allergies.find(a => a.id === id);
                                        return <Chip key={id} label={a ? a.alergy_name : id} size="small" color="warning" />;
                                    })}
                                </Box>
                            )}
                        >
                            {allergies.map(a => (
                                <MenuItem key={a.id} value={a.id}>{a.alergy_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="outlined" component="label" sx={{ borderRadius: '12px' }}>
                        {imageFile ? imageFile.name : editing?.image_url ? 'Change Image' : 'Upload Image'}
                        <input type="file" accept="image/*" hidden onChange={e => setImageFile(e.target.files[0])} />
                    </Button>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}
