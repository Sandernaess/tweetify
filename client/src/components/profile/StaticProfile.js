import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 
import withStyles from '@material-ui/core/styles/withStyles'; 
import moment from 'moment'; 

// MUI
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Icons
import LocationOn from '@material-ui/icons/LocationOn'; 
import LinkIcon from '@material-ui/icons/Link'; 
import CalendarToday from '@material-ui/icons/CalendarToday'; 

// Styling 
import '../../style/profile.css'; 
import { connect } from 'react-redux';


const styles = {
   
    profileBtn: {
        marginBottom: "10px"
    },
    bio: {
        margin: "10px 0px"
    }
};

class StaticProfile extends Component {
  
    render () {
        const { classes, profile: { name, handle, createdAtText, imageURL, bio, website, location }} = this.props; 
 
        return (
            <Paper className={classes.paper}>
            <div className="profile">

                <div className="profile-top">
                    <img className="profile-img" src={ imageURL} alt="profile" />           
                </div>
      
                <div className="profile-details">

                    <div className="details-top">
                        <Typography variant="h5">{name}</Typography>
                        <Typography color="primary" variant="h5">
                            @{handle}
                        </Typography>

                        {bio && <Typography className={classes.bio} variant="body1">{  bio }</Typography>}
                    </div>

                    <div className="details">
                        

                        {location && (
                            <div className="detail">
                                <LocationOn color="primary" /> <span className="icon"> { location } </span>
                            </div>
                        )}

                        {website && (
                            <div className="detail">
                                <LinkIcon color="primary" />
                                <a className="icon" href={website} target="_blank" rel="noopener noreferrer"> {' '} { website} </a>
                            </div>
                        )}
                    
                        <div class="detail">
                            <CalendarToday color="primary" /> {' '} <span className="icon"> Joined {moment(createdAtText).fromNow()}</span>
                        </div>
                    </div>
            
                </div>
            </div>
        </Paper>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user
});


StaticProfile.propTypes = {
    user: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired, 
    classes: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, null)(withStyles(styles)(StaticProfile)); 
