import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// Redux stuff
import { connect } from 'react-redux';
import { editDetails } from '../../redux/actions/userActions.js';

// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Icons
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, Tooltip } from '@material-ui/core';

// Styling 
import '../../style/editDetails.css';

const styles = {

  textField: {
    marginBottom: "15px"
  },
  editBtn: {
    float: "right",
    top: '20px',
    right: '20px'
  },
  editForm: {
    width: '75%', 
    maxWidth: 'unset',
    alignItems: 'start'
  }
};

class EditDetails extends Component {
  state = {
    bio: '',
    website: '',
    location: '',
    open: false
  };
  mapUserDetailsToState = (user) => {
    this.setState({
      bio: user.bio ? user.bio : '',
      website: user.website ? user.website : '',
      location: user.location ? user.location : ''
    });
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.user);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  componentDidMount() {
    const { user } = this.props;
    this.mapUserDetailsToState(user);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    };
    this.props.editDetails(userDetails);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>

        <Tooltip title="Edit profile details" placement="top">
          <Button startIcon={<EditIcon color="inherit" />} color="primary dark" variant="contained" className={classes.editBtn} onClick={this.handleOpen}>Edit Profile</Button>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form className={classes.editForm}>
        
              <TextField
                name="website"
                tpye="text"
                label="Website"
                placeholder="Your personal/professinal website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                tpye="text"
                label="Location"
                placeholder="Where you live"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
              />
               <TextField
                name="bio"
                tpye="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" className="cancelBtn" onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user.user
});

export default connect(
  mapStateToProps,
  { editDetails }
)(withStyles(styles)(EditDetails));