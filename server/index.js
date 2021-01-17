import express from 'express'; 
import bodyParser from 'body-parser'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 

import TweetRoutes from './routes/tweets.js'; 
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

const app = express(); 
dotenv.config();

// firebase
import firebase from './db.js';

// Setting up bodyParser to properly send requests
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors()); 

// Routes
app.use('/tweets', TweetRoutes); 
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// 5000 for local, process.env.PORT is for Heroku
const PORT = process.env.PORT || 5000; 


app.get('/', (req, res) => {
    res.send("Hello from Tweetify API!");
});

app.get("*", (req, res) => {
    res.status(404).send("dsada");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});

