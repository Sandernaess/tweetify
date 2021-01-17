import { SET_Tweet, LIKE_Tweet, UNLIKE_Tweet, LOADING_DATA, SET_Tweets, DELETE_Tweet, POST_Tweet } from '../types'; 

const initialState = {
    tweets: [], 
    tweet: {}, 
    loading: false 
}; 

let index; 

export default function(state = initialState, action) {
    
    switch(action.type) {
        case LOADING_DATA: 
            return {
                ...state, 
                loading: true
            }
        case SET_Tweets: 
            return {
                ...state, 
                tweets: action.payload, 
                loading: false
            }
        
        case SET_Tweet: 
            return {
                ...state, 
                tweet: action.payload
            }
        
        case LIKE_Tweet: 
        case UNLIKE_Tweet:
            index = state.tweets.findIndex((tweet) => tweet.TweetId === action.payload.TweetId); 

            // update the tweet in the tweets object
            state.tweets[index] = action.payload; 
            
            // Update the single tweet object aswell 
            if (state.tweet.TweetId === action.payload.TweetId) {
                state.tweet = action.payload
            }
            
            return {
                ...state
            }
        
        case DELETE_Tweet: 
            index = state.tweets.findIndex((tweet) => tweet.TweetId === action.payload); 
            state.tweets.splice(index, 1); 
            return {
                ...state
            }; 
        
        case POST_Tweet: 
            return {
                ...state, 
                tweets: [
                    action.payload, 
                    ...state.tweets
                ]
            }
    
        default: 
            return state;                 
    }
}