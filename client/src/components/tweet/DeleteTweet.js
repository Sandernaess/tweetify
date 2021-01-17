import React, { Component } from 'react'; 
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 

// MUI 
import Button from '@material-ui/core/Button'; 
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogActions from '@material-ui/core/DialogActions'; 
import IconButton from '@material-ui/core/IconButton'; 

// Icons 
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import MenuIcon from '@material-ui/icons/MoreVert';

// Redux 
import { connect } from 'react-redux'; 
import { deleteTweet } from '../../redux/actions/dataActions'; 
import { Tooltip } from '@material-ui/core';

const styles = {
    deleteBtn: {
        position: 'absolute', 
        left: '92%', 
        top: '3%'
    }
}

export class DeleteTweet extends Component {

    state = {
        open: false
    };

    handleOpen = () => {
        this.setState({ open: true }); 
    }

    handleClose = () => {
        this.setState({ open: false }); 
    }

    deleteTweet = () => {
        console.log("deleting");
        this.props.deleteTweet(this.props.TweetId); 
        this.setState({ open: false }); 
    }

    render() {
        const { classes } = this.props; 


        return (
            <div>
                <Tooltip title="Delete tweet" placement="top">
                    <IconButton onClick={this.handleOpen} className={classes.deleteBtn}>
                        <MenuIcon color="primary" />
                    </IconButton>
                </Tooltip>

                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Are you sure you want to delete this tweet? </DialogTitle>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.deleteTweet} color="secondary">Delete</Button>
                    </DialogActions>

                </Dialog>

            </div>
        )
    }

}


deleteTweet.PropTypes = {
    deleteTweet: PropTypes.func.isRequired, 
    classes: PropTypes.object.isRequired, 
    TweetId: PropTypes.string.isRequired
}; 

export default connect(
    null,
    { deleteTweet }
  )(withStyles(styles)(DeleteTweet));