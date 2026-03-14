import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Box } from '@mui/material';
import Meals from './pages/Meals';
import MealDetail from './pages/MealDetail';
import Menus from './pages/Menus';
import MenuDetail from './pages/MenuDetail';
import Diets from './pages/Diets';
import DietDetail from './pages/DietDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Box sx={{ pt: '70px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/meals" element={<Meals />} />
                    <Route path="/meals/:id" element={<MealDetail />} />
                    <Route path="/menus" element={<Menus />} />
                    <Route path="/menus/:id" element={<MenuDetail />} />
                    <Route path="/diets" element={<Diets />} />
                    <Route path="/diets/:id" element={<DietDetail />} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/subscriptions" element={<ProtectedRoute><div>Subscriptions</div></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Routes>
            </Box>
        </BrowserRouter>
    );
}

export default App;
