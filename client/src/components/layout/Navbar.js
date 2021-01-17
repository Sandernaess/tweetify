import React, { Component } from 'react'; 
import Link from 'react-router-dom/Link'; 

// Material UI 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Button from '@material-ui/core/Button'; 

// Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'; 

// Icons 
import HomeIcon from '@material-ui/icons/Home'; 
import ProfileIcon from '@material-ui/icons/Person'; 
import LogoutIcon from '@material-ui/icons/ExitToApp'
import ExploreIcon from '@material-ui/icons/Public'

// Actions 
import { logoutUser } from '../../redux/actions/userActions'; 

// Components 
import PostTweet from '../tweet/PostTweet'; 

export class Navbar extends Component {


    // Log out user
    handleLogout = () => {
        this.props.logoutUser();
    }

    render() {

        const { 
            user: {
                authenticated,
                user: {
                    ID
                }
            }
        } = this.props; 


        console.log("Auth: ", authenticated); 

        let navOptions; 

        if (!authenticated) {
            navOptions = <div className="nav-options"> 
                <Button startIcon={<HomeIcon />} color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button> 
            </div>
        } else {
            navOptions = <div className="nav-options">
                <Button startIcon={<HomeIcon />} color="inherit" component={Link} to="/">Home</Button>
                <Button startIcon={<ProfileIcon />} color="inherit" component={Link} to={`/profile/${ID}`}>Profile</Button>
                <Button startIcon={<ExploreIcon />} color="inherit" component={Link} to="/">Explore</Button>
                <Button startIcon={<LogoutIcon />} color="inherit" onClick={this.handleLogout}>Logout</Button>
            </div>
        }

        return (
            <AppBar>
                <Toolbar className="nav-container">
                    
                    {navOptions}
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
}); 

// Action props
const mapActionToProps = { logoutUser }; 

Navbar.propTypes = {
    user: PropTypes.object.isRequired, 
    logoutUser: PropTypes.func.isRequired,
}; 


export default connect(mapStateToProps, mapActionToProps)(Navbar); 