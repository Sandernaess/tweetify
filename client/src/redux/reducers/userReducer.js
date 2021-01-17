import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_Tweet, UNLIKE_Tweet } from '../types'; 

const initialState = {
    authenticated: false, 
    credentials: {}, 
    likes: [], 
    loading: false,
    notifications: [], 
    user: {

    }
}; 

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED: 
            return {
                ...state, 
                authenticated: true, 

            }; 

        case SET_UNAUTHENTICATED: 
            return initialState; 

        case SET_USER: 
            return {
                authenticated: true, 
                loading: false,
                ...action.payload
            }; 

        case LOADING_USER: 
            return {
                ...state, 
                loading: true
            }

        case LIKE_Tweet: 
            return {
                ...state, 
                likes: [
                    ...state.likes, 
                    {
                        userHandle: state.user.handle, 
                        TweetId: action.payload.TweetId
                    }
                ]
            }
        
        case UNLIKE_Tweet: 
            return {
                ...state, 
                likes: state.likes.filter((like) => like.TweetId !== action.payload.TweetId)
            }; 

        default: 
            return state; 
    }
}
