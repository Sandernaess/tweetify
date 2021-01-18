import React, { Component } from 'react'; 
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 

// MUI 
import Button from '@material-ui/core/Button'; 
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import CircularProgress from '@material-ui/core/CircularProgress'; 
import Fab from '@material-ui/core/Fab'; 


// Icons 
import AddIcon from '@material-ui/icons/Add'; 
import CloseIcon from '@material-ui/icons/Close'; 

// Redux stuff
import { connect } from 'react-redux';
import { postTweet, clearErrors } from '../../redux/actions/dataActions.js';
import { DialogContent, TextField, Tooltip } from '@material-ui/core';

const styles = {
    textField: {
        marginBottom: "15px"
    },
    submitBtn: {
        marginTop: "20px",
        marginBottom: "10px"
    }, 
    progressSpinner: {

    }, 
    closeBtn: {
        position: 'absolute', 
        left: '88%', 
        top: '5%'
    }, 
    TweetForm: {
        width: "100%", 
        maxWidth: "unset"
    }
}

class PostTweet extends Component {
    state = {
        open: false, 
        body: '', 
        errors: {}
    }; 

    // Check for props 
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        }

        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: '', open: false, errors: {} }); 
        }
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false, errors: {} })
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault(); 
        this.props.postTweet({ body: this.state.body }); 
    }

    render() {
        const { errors } = this.state; 
        const { classes, UI: { loading }} = this.props; 

        return (
            <div>
               
                <Fab onClick={this.handleOpen} variant="extended" color="primary" aria-label="add"> 
                    Post Tweet
                </Fab>
        
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <Tooltip title="Close" placement="top">
                        <Button onClick={this.handleClose} className={classes.closeBtn}><CloseIcon /></Button>
                    </Tooltip>

                    <DialogTitle>Post a new tweet</DialogTitle>

                    <DialogContent>
                        <form className={classes.TweetForm} onSubmit={this.handleSubmit}>
                            <TextField name="body" type="text" label="Your tweet" 
                            multiline rows="3" placeholder="Post a tweet" 
                            error={errors.body ? true : false} helperText={errors.body} 
                            className={classes.TextField} onChange={this.handleChange} fullWidth />
                            
                            <Tooltip title="Submit your tweet" placement="top">
                                <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} disabled={loading}>Submit</Button>
                            </Tooltip>

                            {loading && (
                                <CircularProgress size={30} className={classes.progressSpinner} /> 
                            )}
                           
                        </form>
                    </DialogContent>
                    
                </Dialog>
               
            </div>
        )
    }
}


PostTweet.propTypes = {
    postTweet: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
  };
  
  const mapStateToProps = (state) => ({
    UI: state.UI
  });
  
  export default connect(mapStateToProps,{ postTweet, clearErrors })(withStyles(styles)(PostTweet));

