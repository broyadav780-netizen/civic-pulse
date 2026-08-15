import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
export default function ProtectedRoute({ children }) { const { citizen } = useAuth(); const location = useLocation(); return citizen ? children : <Navigate to="/login" replace state={{ from: location.pathname }} /> }
