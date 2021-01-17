'use strict';
import dotenv from 'dotenv'; 

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    ADMIN_TYPE,
    ADMIN_PRIVATE_KEY_ID,
    ADMIN_PRIVATE_KEY,
    ADMIN_CLIENT_EMAIL,
    ADMIN_CLIENT_ID,
    ADMIN_AUTH_URI,
    ADMIN_TOKEN_URI,
    ADMIN_AUTH_PROVIDER,
    ADMIN_CERT_URL

} = process.env;


// config for Firebase SDK

const config =  {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    }
}

// config for Firebase Admin SDK
export const adminConfig = {
    type: ADMIN_TYPE,
    project_id: PROJECT_ID,
    private_key_id: ADMIN_PRIVATE_KEY_ID,
    private_key: ADMIN_PRIVATE_KEY,
    client_email: ADMIN_CLIENT_EMAIL,
    client_id: ADMIN_CLIENT_ID,
    auth_uri: ADMIN_AUTH_URI,
    token_uri: ADMIN_TOKEN_URI,
    auth_provider_x509_cert_url: ADMIN_AUTH_PROVIDER,
    client_x509_cert_url: ADMIN_CERT_URL
}

export default config; 
