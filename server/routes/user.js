import express from 'express'; 
import FBAuth from '../controllers/FBAuth.js';
import multer from 'multer';

// for image upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

import {uploadImage, getAuthUser, editUserDetails, getUserDetails } from '../controllers/user.js';

const router = express.Router(); 

router.post('/image', FBAuth, upload.single('image'), uploadImage); 
router.get('/', FBAuth, getAuthUser); 
router.post('/', FBAuth, editUserDetails)
router.get('/:id', getUserDetails); 

export default router; 