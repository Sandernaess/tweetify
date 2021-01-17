import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Redux 
import { Provider } from 'react-redux'; 
import store from './redux/store'; 
import { SET_AUTHENTICATED } from './redux/types'; 
import { logoutUser, getUserData } from './redux/actions/userActions'; 

// Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

// Pages
import home from "./pages/home"; 
import login from "./pages/login"; 
import signup from "./pages/signup"; 
import profile from "./pages/profile"; 
import user from './pages/user'; 
import page404 from './pages/page404'; 


// check if user has a valid auth token already
const token = localStorage.FBIdToken;
if (token) {

  // if token available, decode and check if expired: 
  const decodedToken = jwtDecode(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    // token has expired, user have to login again: 
    store.dispatch(logoutUser());
    window.location.href = '/login';

  } else {
    // token has not expired, no need to login
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());

  }
}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
        <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" component={login}  />
              <AuthRoute exact path="/signup" component={signup}  />
              <Route exact path="/profile/:userID" component={profile} />
              <Route exact path="/users/:userID" component={user} />
              <Route path='*' exact={true} component={page404} />
            </Switch>
          </div>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
