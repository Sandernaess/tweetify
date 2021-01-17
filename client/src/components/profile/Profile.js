import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 
import withStyles from '@material-ui/core/styles/withStyles'; 
import { Link } from 'react-router-dom'; 
import moment from 'moment'; 

// MUI 
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'; 
import { CircularProgress, IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip'; 

// Icons
import LocationOn from '@material-ui/icons/LocationOn'; 
import LinkIcon from '@material-ui/icons/Link'; 
import CalendarToday from '@material-ui/icons/CalendarToday'; 

// Redux
import { connect } from 'react-redux'; 
import { logoutUser, uploadImage } from '../../redux/actions/userActions'; 

// Styling 
import '../../style/profile.css'; 

// Components 
import EditDetails from './EditDetails';

const styles = {
    paper: {
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'start', 
        paddingLeft: '20px'
    },
    profileBtn: {
        marginBottom: "10px"
    },
    bio: {
        margin: "10px 0px"
    }
};

class Profile extends Component  {

    // function to use the input for uploading a image, uses a button instead
    handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile != null) {
            console.log("img uploading")
            let fileData = new FormData();
            fileData.set(
                'image',
                selectedFile,
                `${selectedFile.lastModified}-${selectedFile.name}`
            );
            this.props.uploadImage(fileData);

        } else {
            console.log("no img");
        }
       
      };

      handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
      };

      // Log out user
      handleLogout = () => {
        this.props.logoutUser();
      }

    render() {

        const {
            classes,
            user: {
              user: { name, imageURL, handle, bio, website, location, createdAtText },
              loading,
              authenticated
            }
        } = this.props;

        


        let profileMarkup; 
        let bioMarkup = null; 
        let websiteMarkup = null; 
        let locationMarkup = null; 

        if (!loading) {
            
            // Check if user is logged in
            if (authenticated) {
                
                if (bio) {
                    bioMarkup = <Typography className={classes.bio} variant="body1">{ bio }</Typography>
                }
                
                if (website) {
                    websiteMarkup = 
                        <div className="detail">
                            <LinkIcon color="primary" />
                            <a className="icon" href={website} target="_blank" rel="noopener noreferrer"> {' '} { website } </a>
                        </div>
                }

                if (location) {
                    locationMarkup = 
                    <div className="detail">
                        <LocationOn color="primary" /> <span className="icon"> { location } </span>
                    </div>
                }

                
                profileMarkup = 
                    <Paper className={classes.paper}>

                        <section className="profile-top">
                            <img className="profile-img" src={imageURL} alt="profile" />
                            <input
                                type="file"
                                id="imageInput"
                                hidden="hidden"
                                onChange={this.handleImageChange} />
                    
                            <Tooltip title="Edit profile picture" placement="right-start">
                                <IconButton onClick={this.handleEditPicture} className="button">
                                    <EditIcon color="primary"/>
                                </IconButton>
                            </Tooltip>

                            <EditDetails />
                        </section>


                        <section className="profile-details">
                            <article className="details-top">
                                <Typography variant="h5">{name}</Typography>
                                <Typography color="primary" variant="h5">
                                    @{handle}
                                </Typography>

                                {bioMarkup}
                            </article>

                            <article className="details">
                                {websiteMarkup}

                                {locationMarkup}

                                <div class="detail">
                                    <CalendarToday color="primary" /> {' '} <span className="icon"> Joined {moment(createdAtText).fromNow()}</span>
                                </div>
                            </article>


                        </section>

                    </Paper>

            } else {
                profileMarkup = 
                    <Paper>
                        <Typography variant="body2" align="center">
                            No profile found, please login.
                        </Typography>
                        <div className="profile-buttons">
                            <Button className={classes.profileBtn} variant="contained" color="primary" component={Link} to="/login">
                                Login
                            </Button>

                            <Button className={classes.profileBtn} variant="contained" color="secondary" component={Link} to="/signup">
                                Signup
                            </Button>
                        </div>
                    </Paper>
            }
        } else {
            profileMarkup = <Paper> <CircularProgress size={50} /> </Paper> 
        }


        return profileMarkup; 

    }
}


const mapStateToProps = (state) => ({
    user: state.user
});

// Action props
const mapActionToProps = { logoutUser, uploadImage }; 

Profile.propTypes = {
    user: PropTypes.object.isRequired, 
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
}; 

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Profile)); 
