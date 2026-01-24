// Configuration
// @ts-ignore
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: '/keycloak', // TODO : env vars ?
    realm: 'miniverse',            // TODO : env vars ?
    clientId: 'miniverse-client',  // TODO : env vars ?
    enableLogging: true
});

/**
 * Initialise Keycloak et retourne une promesse
 */
export const initKeycloak = async () => {
    try {
        keycloak.onTokenExpired = () => {
            keycloak.updateToken().then(async (refreshed: boolean) => {
                if (refreshed) {
                    console.debug(`Token rafraîchi avec succès`)
                    await cookieStore.set('token', `Bearer ${keycloak.token}`)
                }
            }).catch(() => {
                console.log('Échec du rafraîchissement du token')
            })
        }

        const authenticated = await keycloak.init({
            onLoad: 'login-required',
            pkceMethod: 'S256',
            flow: 'standard'
        });
        await cookieStore.set('token', `Bearer ${keycloak.token}`)

        return authenticated
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Keycloak', error)
        return false
    }
};

export default keycloak