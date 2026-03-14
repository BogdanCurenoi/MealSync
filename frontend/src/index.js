import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Toaster } from 'react-hot-toast';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const AppWithProviders = () => {
    const { clearCart } = useCart();
    return (
        <AuthProvider onLogout={clearCart}>
            <App />
        </AuthProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />
        <CartProvider>
            <AppWithProviders />
        </CartProvider>
    </ThemeProvider>
);
