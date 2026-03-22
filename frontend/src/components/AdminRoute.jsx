import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user || user.role_permission !== 99) return <Navigate to="/" />;
    return children;
}
