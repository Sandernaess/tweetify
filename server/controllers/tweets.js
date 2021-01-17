// firebase
import firebase from '../db.js';
import admin from 'firebase-admin';

const firestore = firebase.firestore();

const TweetRef = firestore.collection('tweet');

// Get all tweets
export const getTweets = async (req, res) => {
    const snapshot = await TweetRef.orderBy("createdAt", "desc").get();

    // check for result
    if (!snapshot.empty) {

        // list with tweets
        let tweets = [];
        // Loop through the result 
        snapshot.forEach(doc => {
            let tweet = {
                TweetId: doc.id,
                body: doc.data().body,
                handle: doc.data().handle,
                createdAt: doc.data().createdAt,
                createdAtText: doc.data().createdAtText,
                user: doc.data().user,
                creatorID: doc.data().creatorID,
                likeCount: doc.data().likeCount,
                userImage: doc.data().userImage,
                commentCount: doc.data().commentCount
            };

            tweets.push(tweet);
        });

        return res.status(200).json(tweets);
    } else {
        // No result
        console.log('No matching documents.');
        return res.status(404).json({
            message: 'No matching documents with the collection.'
        });
    }

}

// Create a tweet
export const createTweet = async (req, res) => {

    if (req.body.body.trim() === '') {
        return res.status(400).json({
            body: 'Body must not be empty'
        });
    }

    // create an object of the tweet
    const newTweet = {
        body: req.body.body,
        user: req.user.user,
        handle: req.user.handle,
        creatorID: req.user.ID,
        userImage: req.user.imageUrl,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        createdAtText: new Date().toUTCString(),
        likeCount: 0,
        commentCount: 0
    };

    // Attempt to insert into db
    try {
        const doc = await TweetRef.add(newTweet);

        // return the result 
        const resultTweet = newTweet;
        resultTweet.TweetId = doc.id;
        console.log('Added document with ID: ', doc.id);

        return res.status(201).json(resultTweet);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

// get a single tweet and its comments 
export const getTweet = (req, res) => {
    let TweetData = {}

    firestore.doc(`/tweet/${req.params.id}`).get()
        .then((doc) => {

            // check if the tweet exists first
            if (!doc.exists) {
                return res.status(404).json({
                    error: 'Tweet not found'
                });
            }

            // if exits, save the data and id
            TweetData = doc.data();
            TweetData.TweetId = doc.id;

            // Get the comments for the tweet 
            return firestore.collection('comments').orderBy('createdAt', 'desc').where('TweetId', '==', req.params.id).get();

        }).then((data) => {
            // create an array for the comments 
            TweetData.comments = [];

            // add each comment into the comments array 
            data.forEach((doc) => {
                TweetData.comments.push(doc.data());
            });

            return res.json(TweetData);

        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err.code
            });
        })
}

// Like a tweet
export const likeTweet = (req, res) => {
    const likeDocument = firestore
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('TweetId', '==', req.params.id)
        .limit(1);

    const TweetDocument = firestore.doc(`/tweet/${req.params.id}`);

    let TweetData;

    TweetDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                TweetData = doc.data();
                TweetData.TweetId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({
                    error: 'Tweet not found'
                });
            }
        })
        .then((data) => {
            if (data.empty) {
                return firestore
                    .collection('likes')
                    .add({
                        TweetId: req.params.id,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        TweetData.likeCount++;
                        return TweetDocument.update({
                            likeCount: TweetData.likeCount
                        });
                    })
                    .then(() => {
                        // Get the comments for the tweet 
                        return firestore.collection('comments').orderBy('createdAt', 'desc').where('TweetId', '==', req.params.id).get();
                    })
                    .then((data) => {
                        TweetData.comments = [];
                        // add each comment into the comments array 
                        data.forEach((doc) => {
                            TweetData.comments.push(doc.data());
                        });

                        return res.json(TweetData);
                    });
            } else {
                return res.status(400).json({
                    error: 'Tweet already liked'
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: err.code
            });
        });
};

// unlike a tweet 
export const unlikeTweet = async (req, res) => {

    const likeDocument = firestore
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('TweetId', '==', req.params.id)
        .limit(1);

    const TweetDocument = firestore.doc(`/tweet/${req.params.id}`);

    let TweetData = {};

    // first check if the tweet exists
    TweetDocument.get()
        .then(doc => {
            if (doc.exists) {
                // if the tweet exists, check if user has liked it already
                TweetData = doc.data();
                TweetData.TweetId = doc.id;
                return likeDocument.get();

            } else {
                // Could not find given tweet with ID
                return res.status(404).json({
                    error: 'Tweet not found'
                });
            }
        }).then((data) => {
            // Check no liked registered by the user on the tweet, attempt to insert the like
            if (data.empty) {
                console.log(err);
                return res.status(500).json({
                    error: err.code
                });
            } else {
                return firestore.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        TweetData.likeCount--;
                        return TweetDocument.update({
                            likeCount: TweetData.likeCount
                        });

                    }).then(() => {
                        // Get the comments for the tweet 
                        return firestore.collection('comments').orderBy('createdAt', 'desc').where('TweetId', '==', req.params.id).get();

                    }).then((data) => {
                        TweetData.comments = [];

                        // add each comment into the comments array 
                        data.forEach((doc) => {
                            TweetData.comments.push(doc.data());
                        });

                        return res.json(TweetData);
                    })

            }

        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err.code
            });
        })
}

// Delete a tweet 
export const deleteTweet = (req, res) => {
    let validDocument = false;
    let owner = false;

    console.log(req.params.id);

    const document = firestore.doc(`/tweet/${req.params.id}`);
    document.get().then((doc) => {

        if (!doc.exists) {
            return res.status(404).json({
                error: 'Tweet not found'
            });
        } else {
            validDocument = true;
        }

        if (doc.data().creatorID !== req.user.ID) {
            return res.status(403).json({
                error: 'Unauthorized'
            });
        } else {
            owner = true;
            return document.delete();
        }

    }).then(() => {
        if (owner && validDocument) {
            return res.json({
                message: 'Tweet deleted successfully'
            });
        }

    }).catch((err) => {
        return res.status(500).json({
            error: err.code
        });
    })

}

// Comment a tweet
export const commentTweet = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({
            comment: 'Comment must not be empty'
        });
    }

    if (req.params.id.trim() === '') {
        return res.status(400).json({
            id: 'Must have a valid tweet id'
        });
    }

    let TweetData = {};

    // Make an object with details of the comment 
    const newComment = {
        body: req.body.body,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        TweetId: req.params.id,
        user: req.user.user,
        userImage: req.user.imageUrl,
        createdAtText: new Date().toUTCString()
    };

    // check if the tweet exists 
    firestore.doc(`tweet/${req.params.id}`).get()
        .then((doc) => {

            // Check if the document given exists
            if (!doc.exists) {

                return res.status(404).json({
                    comment: 'Tweet not found'
                });

            } else {

                TweetData.TweetId = doc.id;

                // If exists, increment the comment count for the tweet
                return doc.ref.update({
                    commentCount: doc.data().commentCount + 1
                });
            }

        }).then(() => {

            // then add the new comment into firestore
            return firestore.collection('comments').add(newComment);

        }).then(() => {

            return res.json(TweetData);

        });

}