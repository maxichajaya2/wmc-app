import { ROUTES_PATHS } from '@/constants';
import { useAuthIntranetStore } from '@/modules/intranet/auth/store';
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {

    const user = useAuthIntranetStore(state => state.user);
    const hasHydrated = useAuthIntranetStore(state => state._hasHydrated);

    if (hasHydrated && user) {
        return <Navigate to={ROUTES_PATHS.PROFILE} />
    }

    return (
        <Outlet />
    )
}

export default AuthLayout