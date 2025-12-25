import { useEffect, type FC } from 'react';
import { useNavigate } from "react-router-dom"
import { signinRedirectionCallback } from './user-service';

const SigninOidc: FC<{}> = () => {
    const navigate = useNavigate();
    useEffect(() => {
        async function signinAsync() {
            await signinRedirectionCallback();
            navigate('/');
        }
        signinAsync();
    }, [navigate]);
    return <div>Redirecting...</div>;
};

export default SigninOidc;