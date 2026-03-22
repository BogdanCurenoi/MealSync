import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const PER_PAGE = 5;

const OrderRow = ({ order }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <TableRow hover>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.login_user} ({order.user_name} {order.user_surname})</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString('ro-RO')}</TableCell>
                <TableCell>{parseFloat(order.total_price).toFixed(2)} RON</TableCell>
                <TableCell>{parseFloat(order.delivery_cost).toFixed(2)} RON</TableCell>
                <TableCell>{(parseFloat(order.total_price) + parseFloat(order.delivery_cost)).toFixed(2)} RON</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={7} sx={{ py: 0 }}>
                    <Collapse in={open} unmountOnExit>
                        <Box sx={{ py: 1, px: 4 }}>
                            {order.items.map(item => (
                                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                    <Typography variant="body2">{item.meal_name || item.menu_name} × {item.quantity}</Typography>
                                    <Typography variant="body2">{(item.item_price * item.quantity).toFixed(2)} RON</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/orders', { withCredentials: true }).then(res => setOrders(res.data));
    }, []);

    const pageCount = Math.ceil(orders.length / PER_PAGE);
    const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <AdminLayout>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Orders</Typography>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F0EDE4' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Delivery</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map(o => <OrderRow key={o.id} order={o} />)}
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
