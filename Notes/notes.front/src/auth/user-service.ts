import { UserManager, type UserManagerSettings } from "oidc-client";
import { setAuthHeader } from "./auth-headers";

const userManagerSettings: UserManagerSettings = {
    client_id: 'notes-web-api',
    redirect_uri: 'https://localhost:5173/signin-oidc',
    response_type: 'code',
    scope: 'openid profile NotesWebAPI',
    authority: 'https://localhost:7057/',
    post_logout_redirect_uri: 'https://localhost:5173/signout-oidc',
    automaticSilentRenew: true
};


const userManager = new UserManager(userManagerSettings)
export async function loadUser() {
    const user = await userManager.getUser();
    console.log('User: ', user);
    const token = user?.access_token;
    setAuthHeader(token);
};

export const signinRedirect = () => userManager.signinRedirect();

export const signinRedirectionCallback = () => userManager.signinRedirectCallback();

export const signoutRedirect = (args?: any) => {
    userManager.clearStaleState();
    userManager.removeUser();
    return userManager.signoutRedirect(args);
};

export const signoutRedirectionCallback = () => {
    userManager.clearStaleState();
    userManager.removeUser();
    return userManager.signoutRedirectCallback(); 
}

export default userManager;