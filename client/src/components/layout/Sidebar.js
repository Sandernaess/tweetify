import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 
import withStyles from '@material-ui/core/styles/withStyles'; 
import { Link } from 'react-router-dom'; 

// MUI 
import Button from '@material-ui/core/Button'
import MuiLink from '@material-ui/core/Link'; 
import Paper from '@material-ui/core/Paper'; 
import { CircularProgress, IconButton, Typography } from '@material-ui/core';

// Redux
import { connect } from 'react-redux'; 
import { logoutUser } from '../../redux/actions/userActions'; 

// Styling 

// Components 
import PostTweet from '../tweet/PostTweet'; 


const styles = {
    profileImg: {
        borderRadius: '50%', 
        width: '100px',
        height: '100px',
        marginRight: '10px'
    }, 
    top: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        padding: '5px 20px'
    },
    actions: {
        display: 'flex',
        alignItems: 'center', 
        flexDirection: 'column',
        paddingBottom: '15px'
    },
    authButtons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    authButton: {
        margin: '20px 10px'
    }
}

class Sidebar extends Component {
    render() {

        const {
            classes,
            user: {
              user: { name, handle, imageURL, bio, website, location, createdAtText, ID },
              loading,
              authenticated
            }
        } = this.props;
    
        let sidebarMarkup; 
        if (!loading) {

            if (authenticated) {
                sidebarMarkup = 
                <Paper>
                    <div className={classes.top}>
                        <img className={classes.profileImg} src={imageURL} alt="profile" />
                        <div className={classes.profileName}>
                            <Typography variant="h5">{name}</Typography>
                            <MuiLink className={classes.name} component={Link} to={`profile/${ID}`} color="primary" variant="h6">
                            @{handle}
                            </MuiLink>
                        </div>
                    </div>

                    <div className={classes.actions}>
                        <PostTweet />
                    </div>
                </Paper>
            } else {
                sidebarMarkup = 
                <Paper>
                    <div>
                        <Typography variant="h6" align="center">
                            No profile found, please login.
                        </Typography>

                        <div className={classes.authButtons}>
                        <Button className={classes.authButton} variant="contained" color="primary" component={Link} to="/login">
                            Login
                        </Button>

                        <Button className={classes.authButton} variant="contained" color="secondary" component={Link} to="/signup">
                            Signup
                        </Button> 
                        </div>

                    </div>
                </Paper>
            }
        } else {
            sidebarMarkup = <CircularProgress size={50} />
        }

        return sidebarMarkup; 
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

// Action props
const mapActionToProps = { logoutUser }; 

Sidebar.propTypes = {
    user: PropTypes.object.isRequired, 
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired
}; 

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Sidebar)); 

