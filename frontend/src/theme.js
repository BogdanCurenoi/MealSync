import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#E63946' },
        secondary: { main: '#FFC60A' },
        background: { default: '#FFFDF7', paper: '#FFFFFF' },
        text: { primary: '#1A1A2E', secondary: '#555555' }
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: '50px', padding: '10px 28px' }
            }
        }
    }
});

export default theme;
