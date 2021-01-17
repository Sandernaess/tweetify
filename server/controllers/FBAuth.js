import db from '../db.js';
import admin from 'firebase-admin';

// Initialize firestore
const firestore = db.firestore();
const userRef = firestore.collection('users');

export const FBAuth = (req, res, next) => {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({
            error: 'Unauthorized'
        });
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return userRef.where('ID', '==', req.user.uid).limit(1).get();
        }).then((data) => {
            req.user.ID = req.user.uid;
            req.user.handle = data.docs[0].data().handle;
            req.user.user = data.docs[0].data().name;
            req.user.imageUrl = data.docs[0].data().imageURL;
            return next();
        }).catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        })

};

export default FBAuth;