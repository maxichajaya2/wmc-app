
import { ROUTES_PATHS } from '@/constants';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthIntranetStore } from '../store';
import { Loader } from '@/shared';

function ConfirRegisterPage() {
    const { search } = useLocation()
    const token = new URLSearchParams(search).get('token')
    const router = useNavigate();

    const confirmRegister = useAuthIntranetStore(state => state.confirmRegister)

    React.useEffect(() => {
        (async () => {
            if (token) {
                try {
                    await confirmRegister(token)
                    router(ROUTES_PATHS.TECHNICAL_WORK_TRAY)
                } catch (error) {
                    console.error(error)
                    router(ROUTES_PATHS.LOGIN)
                }
            } else {
                router(ROUTES_PATHS.LOGIN)
            }
        })()
    }, [token])
    return (
        <Loader />
    )
}

export default ConfirRegisterPage