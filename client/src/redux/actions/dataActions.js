import { SET_Tweets, LOADING_DATA, LIKE_Tweet, UNLIKE_Tweet, DELETE_Tweet, LOADING_UI, SET_ERRORS, CLEAR_ERRORS, POST_Tweet, SET_Tweet, STOP_LOADING_UI, SUBMIT_COMMENT } from '../types'; 
import axios from 'axios'; 

// Get all tweets 
export const getTweets = () => dispatch => {
    dispatch({ type: LOADING_DATA }); 
    axios.get('/tweets')
        .then(res => {
            
            dispatch({
                type: SET_Tweets,
                payload: res.data
            });

        }).catch(err => {
            dispatch({
                type: SET_Tweets, 
                payload: []
            }); 
        }); 
}

// Get a single tweet
export const getTweet = (TweetId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    
    axios.get(`/tweets/${TweetId}`)   
        .then(res => {
            dispatch({
                type: SET_Tweet, 
                payload: res.data
            }); 

            dispatch({ type: STOP_LOADING_UI}); 

        }).catch((err) => {
            console.log(err); 
        })

}

// Post a tweet 
export const postTweet = (newTweet) => (dispatch) => {
    dispatch({ type: LOADING_UI })
    axios.post('/tweets', newTweet)
        .then(res => {
            dispatch({
                type: POST_Tweet, 
                payload: res.data
            }); 

            dispatch(clearErrors())

        }).catch(err => {
            dispatch({
                type: SET_ERRORS, 
                payload: err.response.data
            })
            
        })
}

// Like a tweet
export const likeTweet = (TweetId) => (dispatch) => {
    
    axios
      .get(`/tweets/${TweetId}/like`)
      .then((res) => {
        dispatch({
          type: LIKE_Tweet,
          payload: res.data
        });

      })
      .catch((err) => console.log(err));
  };


// Unlike tweet 
export const unlikeTweet = (TweetId) => (dispatch) => {
    axios.get(`/tweets/${TweetId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_Tweet, 
                payload: res.data
            }); 
        }).catch(err => {
            console.log(err); 
        })
}

// Submit a comment 
export const submitComment =(TweetId, commentData) => (dispatch) => {
    axios.post(`/tweets/${TweetId}/comment`, commentData)
        .then(() => {
            dispatch(getTweet(TweetId));
            dispatch(clearErrors());

        }).catch(err => {
            dispatch({
                type: SET_ERRORS, 
                payload: err.response.data
            });
        });

}


// Delete a tweet 
export const deleteTweet = (TweetId) => (dispatch) => {
    axios.delete(`/tweets/${TweetId}/delete`)
        .then(() => {
            dispatch({ type: DELETE_Tweet, payload: TweetId})
        })
        .catch((err) => {
            console.log(err); 
        })
}

// Get data about a user you are viewing / viewing a user profile 
export const getUserData = (user) => (dispatch) => {
    dispatch({ type: LOADING_DATA }); 

    axios.get(`/user/${user}`)
        .then(res => {
        
            dispatch({
                type: SET_Tweets, 
                payload: res.data.tweets
            }); 

        }).catch((err) => {
            dispatch({
                type: SET_Tweets, 
                payload: []
            })
        }); 
}

export const clearErrors = () => dispatch => {
    dispatch ({ type: CLEAR_ERRORS }); 
}