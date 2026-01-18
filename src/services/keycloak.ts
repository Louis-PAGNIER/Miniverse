// Configuration
// @ts-ignore
import Keycloak from "keycloak-js";
import axios from "axios";

const keycloak = new Keycloak({
    url: 'http://localhost:8080/', // TODO : env vars ?
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
            keycloak.updateToken().then((refreshed: boolean) => {
                if (refreshed) {
                    console.debug(`Token rafraîchi avec succès`)
                    document.cookie = `token=Bearer ${keycloak.token}`
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
        document.cookie = `token=Bearer ${keycloak.token}`

        return authenticated
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Keycloak', error)
        return false
    }
};

export default keycloak