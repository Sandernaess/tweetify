// Firebase
import db from '../db.js';
import admin from 'firebase-admin';
import firebase from 'firebase';
import config from '../config.js';

import { validateSignupData, validateLoginData } from './validators.js';

// Initialize firestore
const firestore = db.firestore();

firebase.initializeApp(config.firebaseConfig);

// Handle login of users 
export const login = async (req, res) => {

  // Store user info given in a object 
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  // Check for valid inputs
  const { valid,errors } = validateLoginData(user);

  // if valid inputs, attempt to login
  if (valid) {
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        // if succesful, return the token 
        return data.user.getIdToken();
      })
      .then((token) => {
        console.log("token: ", token);
        return res.json({
          token
        });
      })
      .catch((err) => {
        console.log(err);

        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          return res.status(403).json({
            general: 'Wrong credentials, email and password does not match.'
          })
        } else if (err.code === "auth/too-many-requests") {
          return res.status(404).json({
            general: 'Access to this account has been temporarily disabled due to many failed login attempts.'
          })
        } else {
          return res.status(403).json(err);
        }

      });

  } else {
    // Not valid inputs, respond with the errors 
    console.log("not valid!");
    return res.status(404).json(errors);
  }
}

// Sign up/register users 
export const signup = async (req, res) => {
  console.log("Attempting register..");

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    name: req.body.name
  };

  // Validate the inputs given from the user
  const {
    valid,
    errors
  } = validateSignupData(newUser);

  // Set the default image when creating a user 
  const defaultImage = "user-img.png";

  // If no errors, attempt to create the user 
  if (valid) {

    let userId, token;

    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then((data) => {
        // if user creation succesful, insert user information to FireStore

        // Get the user ID generated 
        userId = data.user.uid;
        console.log("Created user with: ", userId);

        // Create an object with user info
        const userCredentials = {
          name: req.body.name,
          handle: req.body.handle,
          ID: userId,
          imageURL: `https://firebasestorage.googleapis.com/v0/b/${config.firebaseConfig.storageBucket}/o/${defaultImage}?alt=media`,
          createdAt: admin.firestore.Timestamp.fromDate(new Date()),
          createdAtText: new Date().toUTCString()
        };

        // Attempt to insert info to Firestore:      
        firestore.collection('users').doc(`${userCredentials.ID}`).set(userCredentials)
          .then(() => {
            console.log("user info inserted to db!");
          })
          .catch((err) => {
            console.log(err);
          })

        // return the generated token: 
        return data.user.getIdToken();

      })
      .then((idToken) => {
        token = idToken;
      })
      .then(() => {
        return res.status(201).json({
          token
        });
      })
      .catch((err) => {
        console.log("Error: ", err);
        if (err.code === "auth/email-already-in-use") {
          return res.status(403).json({
            general: 'Selected email is already in use'
          })
        } else {
          return res.status(500).json(err);
        }
      });

  } else {
    //return the input errors 
    console.log("not valid");
    return res.status(400).json(errors);
  }
}