import { ROUTES_PATHS } from '@/constants';
import { useSessionBoundStore } from '@/modules/back-office/auth/store/session.store';
import { Loader } from '@/shared';
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {

    const authStatus = useSessionBoundStore(state => state.status);
    const checkAuthStatus = useSessionBoundStore(state => state.checkAuthStatus);

    if (authStatus === 'pending') {
        checkAuthStatus();
        return <Loader />
    }

    if (authStatus === 'authorized') {
        return <Navigate to={ROUTES_PATHS.TECHINICAL_WORKS} />
    }

    return (
        <Outlet />
    )
}

export default AuthLayout