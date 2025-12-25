import React, { useEffect, useRef, type FC } from "react";
import { User, UserManager } from "oidc-client";
import { setAuthHeader } from "./auth-headers";

type AuthProviderProps = {
    userManager: UserManager;
    children: React.ReactNode; 
};

export const AuthProvider: FC<AuthProviderProps> = ({ 
    userManager: manager,
    children,
}) => {
    const userManager = useRef<UserManager | null>(null); 

    useEffect(() => {
        userManager.current = manager;

        const onUserLoaded = (user: User) => {
            console.log('User loaded: ', user);
            setAuthHeader(user.access_token);
        };
        const onUserUnloaded = () => {
            setAuthHeader(null);
            console.log('User unloaded');
        };
        const onAccessTokenExpiring = () => {
            console.log('User token expiring');
            // Пытаемся обновить токен втихую
            userManager.current?.signinSilent().catch(e => {
                console.error("signinSilent error", e);
            });
        };
        const onAccessTokenExpired = () => {
            console.log('User token expired');
            // Можно либо попытаться обновить токен, либо выйти из системы
             userManager.current?.signinSilent().catch(e => {
                console.error("signinSilent error", e);
            });
        };
        const onUserSignedOut = () => {
            console.log('User signed out');
        };

        
        if (userManager.current) {
            userManager.current.events.addUserLoaded(onUserLoaded);
            userManager.current.events.addUserUnloaded(onUserUnloaded);
            userManager.current.events.addAccessTokenExpired(onAccessTokenExpired);
            userManager.current.events.addAccessTokenExpiring(onAccessTokenExpiring);
            userManager.current.events.addUserSignedOut(onUserSignedOut);
        }

        return function cleanup() {
            if (userManager.current) {
                userManager.current.events.removeUserLoaded(onUserLoaded);
                userManager.current.events.removeUserUnloaded(onUserUnloaded);
                userManager.current.events.removeAccessTokenExpired(onAccessTokenExpired);
                userManager.current.events.removeAccessTokenExpiring(onAccessTokenExpiring);
                userManager.current.events.removeUserSignedOut(onUserSignedOut);
            }
        };
    }, [manager]);

    
    return React.Children.only(children);
};

export default AuthProvider;