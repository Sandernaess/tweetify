import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import tweetRoutes from './routes/tweets.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();


// Setting up bodyParser to properly send requests
app.use(bodyParser.json({
  limit: "30mb",
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: "30mb",
  extended: true
}));
app.use(cors());

// Routes
app.use('/tweets', tweetRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// 5000 for local, process.env.PORT is for Heroku
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send("Hello from Tweetify API!");
});

app.get("*", (req, res) => {
  res.status(404).send("404, the route you were looking for does not exist.");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});