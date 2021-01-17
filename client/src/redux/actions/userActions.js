import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER} from '../types'; 
import axios from 'axios'; 

// Login a user
export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI }); 

    axios.post('auth/login', userData)
        .then(res => {
            // Succesful
            setAuthorizationHeader(res.data.token)

            dispatch(getUserData()); 
            dispatch({ type: CLEAR_ERRORS});
            // redirect to home page
            history.push('/'); 
        }).catch(err => {
            console.log(err); 
            dispatch({
                type: SET_ERRORS, 
                payload: err.response.data
            }); 
        });
}

// Get data about user
export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER, 
                payload: res.data
            })
        }).catch(err => console.log(err));  
}


// Sign up a user 
export const signupUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI }); 
     // Send to the server
     axios.post('auth/signup', userData)
     .then(res => {
        
        // Succesful
        setAuthorizationHeader(res.data.token)
       
        dispatch(getUserData()); 
        dispatch({ type: CLEAR_ERRORS});
        // redirect to home page
        history.push('/'); 
     }).catch(err => {
        console.log(err);

        dispatch({
            type: SET_ERRORS, 
            payload: err.response.data
        }); 
    }); 
        
};

// Upload profile picture
export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
   
    axios
      .post('/user/image', formData)
      .then(() => {
        dispatch(getUserData());
      })
      .catch((err) => {
        dispatch(getUserData());
        console.log(err)
      });
  };

// Logout current user
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken'); 
    delete axios.defaults.headers.common['Authorization']; 
    dispatch({ type: SET_UNAUTHENTICATED })
}


// Sends request to edit details of user
export const editDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER }); 
    axios.post('/user', userDetails)
    .then(() => {
        dispatch(getUserData()); 
    })
    .catch((err) => {
        console.log(err); 
    })
}

// set Auth
const setAuthorizationHeader = (token) => {
      // Store token in localStorage
      const FBIdToken = `Bearer ${token}`; 

      localStorage.setItem('FBIdToken', FBIdToken);
    
      axios.defaults.headers.common['Authorization'] = FBIdToken; 
}

// Sends request to edit details of user
