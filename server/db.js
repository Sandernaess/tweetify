import admin from 'firebase-admin'; 
import { adminConfig } from './config.js'

const db = admin.initializeApp({
    credential: admin.credential.cert(adminConfig)
});

export default db; 