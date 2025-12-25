import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom"
import { signoutRedirectionCallback } from './user-service';

const SignoutOidc: FC<{}> = () => {
    const navigate = useNavigate();
    useEffect(() =>{
        const signoutAsync = async () => {
            await signoutRedirectionCallback();
            navigate('/');
        };
        signoutAsync();
    }, [navigate])
    return <div>Redirection...</div>
};

export default SignoutOidc;