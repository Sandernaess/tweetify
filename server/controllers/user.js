import config from '../config.js';
import { v4 as uuidv4 } from 'uuid';

// firebase
import admin from 'firebase-admin';
import firebase from '../db.js';
const firestore = firebase.firestore();

import {
  reduceUserDetails
} from './validators.js';

// Edit / add details of the user
export const editUserDetails = async (req, res) => {

  // Validate the inputs given 
  let userDetails = reduceUserDetails(req.body);

  firestore.doc(`/users/${req.user.uid}`).update(userDetails)
    .then(() => {
      return res.json({
        message: 'Details added successfully'
      });
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code
      });
    });

}


/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */


// Handle profile image upload 
export const uploadImage = async (req, res) => {

  // Check if a file has been sent
  let file = req.file;
  if (file) {

    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {

      let newFileName = file.originalname;

      // String for image token
      let generatedToken = uuidv4();

      // Set the filename with the firestorage
      let fileUpload = admin.storage().bucket(config.firebaseConfig.storageBucket).file(newFileName);

      // Create a write stream with metadata for firestorage
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          metadata: {
            contentType: file.mimetype,
            firebaseStorageDownloadTokens: generatedToken
          }
        }
      });

      blobStream.on('error', (error) => {
        console.log(error);
      });

      blobStream.on('finish', () => {
        // Stream finished, attempt to insert the created imageURL to firestore
        console.log("inserting to firestore..");

        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${config.firebaseConfig.storageBucket}/o/${newFileName}?alt=media&token=${generatedToken}`;

        firestore.doc(`/users/${req.user.uid}`).update({
          imageURL
        }).then(() => {

          // Succesful insert
          console.log("inserted!")

          // Update the profile image in the tweets of the user
          let newImage = {
            userImage: imageURL
          };

          firestore.collection("tweet")
            .where("creatorID", "==", req.user.uid).get()
            .then((data) => {

              data.forEach((doc) => {
                firestore.collection('tweet').doc(doc.id).update(newImage);
              });

            });

          // return the new image
          return res.status(200).json(imageURL);
        }).catch((err) => {
          console.log(err);
        })

      });

      // end the blobstream
      blobStream.end(file.buffer);
    } else {
      console.log("not jpg or png");
      return res.status(500).json({
        message: 'Image must be either .jpg or .png format'
      })
    }

  } else {
    return res.status(500).json({
      message: 'No file found.'
    });
  }
}

// Get the details for the logged in user
export const getAuthUser = async (req, res) => {
  // Get own user details
  let userData = {};

  // Get the document with the user ID: 
  firestore.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {

        // if the doc exists, get the data and get the likes for the user
        userData.user = doc.data();
        return firestore.collection('likes').where('userHandle', '==', req.user.handle).get()

      } else {
        return res.status(404).json({
          error: "User not found"
        });
      }

    }).then(data => {
      userData.likes = [];

      data.forEach(doc => {
        userData.likes.push(doc.data());
      });

      // return the data about the user
      return res.json(userData);
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code
      });
    });
}

// Get the details for viewing your own or other profiles
export const getUserDetails = (req, res) => {
  let userData = {}
  let validID = false;
  console.log("given ID: ", req.params.id);

  // Get the document of the user with the userID
  firestore.doc(`/users/${req.params.id}`).get()
    .then((doc) => {

      // Check if a user with the ID exists, before grabbing the data 
      if (doc.exists) {
        console.log("found docs!");
        validID = true;
        userData.user = doc.data();
      }

      if (validID) {
        console.log("checking tweets..");
        firestore.collection("tweet")
          .where("creatorID", "==", req.params.id).orderBy("createdAt", "desc").get()
          .then((data) => {

            userData.tweets = [];

            if (!data.empty) {
              console.log("user has tweets");
              data.forEach((doc) => {

                let tweet = {
                  body: doc.data().body,
                  createdAt: doc.data().createdAt,
                  createdAtText: doc.data().createdAtText,
                  user: doc.data().user,
                  handle: doc.data().handle,
                  creatorID: doc.data().creatorID,
                  userImage: doc.data().userImage,
                  likeCount: doc.data().likeCount,
                  commentCount: doc.data().commentCount,
                  TweetId: doc.id
                }

                // add the tweet to the array 
                userData.tweets.push(tweet);

              });

            } else {
              console.log("no tweets..");
            }

            return res.json(userData);

          }).catch((err) => {
            console.log(err);
            return res.status(500).json({
              error: err.code
            });
          });

      } else {
        console.log("Not valid ID");
        return res.status(404).json({
          error: "User with given ID not found"
        });
      }

    }).catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code
      });
    });
}