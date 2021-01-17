import express from 'express'; 
import FBAuth from '../controllers/FBAuth.js';

import { getTweets, createTweet, getTweet, likeTweet, unlikeTweet, commentTweet, deleteTweet } from '../controllers/tweets.js';

const router = express.Router(); 

router.get('/', getTweets); 
router.post('/', FBAuth, createTweet); 
router.get('/:id', getTweet)

router.delete('/:id/delete', FBAuth, deleteTweet); 
router.get('/:id/like', FBAuth, likeTweet); 
router.get('/:id/unlike', FBAuth, unlikeTweet); 
router.post('/:id/comment', FBAuth, commentTweet); 


export default router; 

