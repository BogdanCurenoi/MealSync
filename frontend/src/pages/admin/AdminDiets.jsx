import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const emptyDiet = { diet_name: '', description: '', menu_ids: [] };
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };
const PER_PAGE = 5;

export default function AdminDiets() {
    const [diets, setDiets] = useState([]);
    const [menus, setMenus] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyDiet);
    const [page, setPage] = useState(1);

    const load = () => Promise.all([
        axios.get('http://localhost:5000/api/admin/diets', { withCredentials: true }),
        axios.get('http://localhost:5000/api/admin/menus', { withCredentials: true })
    ]).then(([d, m]) => { setDiets(d.data); setMenus(m.data); });

    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm(emptyDiet); setDialogOpen(true); };

    const openEdit = (diet) => {
        setEditing(diet);
        setForm({
            diet_name: diet.diet_name,
            description: diet.description,
            menu_ids: diet.menus ? diet.menus.map(m => m.id) : []
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://localhost:5000/api/admin/diets/${editing.id}`, form, { withCredentials: true });
                toast.success('Diet updated');
            } else {
                await axios.post('http://localhost:5000/api/admin/diets', form, { withCredentials: true });
                toast.success('Diet created');
            }
            setDialogOpen(false);
            load();
        } catch {
            toast.error('Failed to save diet');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/diets/${id}`, { withCredentials: true });
            toast.success('Diet deleted');
            load();
        } catch {
            toast.error('Failed to delete diet');
        }
    };

    const pageCount = Math.ceil(diets.length / PER_PAGE);
    const paginated = diets.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Diets</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreate}>Add Diet</Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F0EDE4' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Menus</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map(d => (
                            <TableRow key={d.id} hover>
                                <TableCell>{d.id}</TableCell>
                                <TableCell>{d.diet_name}</TableCell>
                                <TableCell>{d.description}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {d.menus && d.menus.length > 0
                                            ? d.menus.map(m => <Chip key={m.id} label={m.menu_name} size="small" />)
                                            : <Typography variant="body2" color="text.secondary">—</Typography>
                                        }
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => openEdit(d)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(d.id)} sx={{ color: '#E63946' }}><DeleteOutlineIcon /></IconButton>
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
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Diet' : 'Add Diet'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Name" value={form.diet_name} onChange={e => setForm({ ...form, diet_name: e.target.value })} fullWidth sx={inputSx} />
                    <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={4} sx={inputSx} />
                    <FormControl fullWidth>
                        <InputLabel>Menus</InputLabel>
                        <Select
                            multiple
                            value={form.menu_ids}
                            onChange={e => setForm({ ...form, menu_ids: e.target.value })}
                            input={<OutlinedInput label="Menus" sx={{ borderRadius: '12px' }} />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(id => {
                                        const m = menus.find(m => m.id === id);
                                        return <Chip key={id} label={m ? m.menu_name : id} size="small" />;
                                    })}
                                </Box>
                            )}
                        >
                            {menus.map(m => (
                                <MenuItem key={m.id} value={m.id}>{m.menu_name}</MenuItem>
                            ))}
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
