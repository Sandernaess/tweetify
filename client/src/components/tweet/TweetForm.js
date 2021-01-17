import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom'; 

// MUI 
import Button from '@material-ui/core/Button'; 
import TextField from '@material-ui/core/TextField'; 

// Redux 
import { connect } from 'react-redux'; 
import { submitComment } from '../../redux/actions/dataActions'; 
import { Typography } from '@material-ui/core';

const styles = {
    commentForm: {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
    },
    divider: {
        width: '100%'
    }, 
    formBox: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center', 
        flexDirection: 'column'
    },

    loginBox: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center', 
        flexDirection: 'column'
    },

    form: {
        marginTop: '15px',
        width: '90%',
        maxWidth: '600px',
        marginBottom: '10px'
    },
    TextField: {
        marginBottom: '10px'
    }, 
    submitButton: {
        marginTop: '10px'
    },
    loginText: {
        paddingTop: '10px',
        paddingBottom: '10px'
    },
    loginButton: {
        marginBottom: '20px'
    }

}

export class CommentForm extends Component {

    state = {
        body: '',
        errors: {} 
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({errors: nextProps.UI.errors});
        }

        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: ''});
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }); 
    }

    handleSubmit = (event) => {
        event.preventDefault(); 
        this.props.submitComment(this.props.TweetId, { body: this.state.body }); 
    }

    render() {

        const { classes, authenticated } = this.props; 
        const errors = this.state.errors; 

        let commentFormMarkup; 

        if (authenticated) {
            commentFormMarkup = 
                <article className={classes.commentForm}>
                    
                    <hr className={classes.divider}/>
                    
                    <article className={classes.formBox}>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
                            <TextField className={classes.TextField} name="body" type="text" 
                            label="Comment on tweet" error={errors.comment ? true : false} 
                            helperText={errors.comment} value={this.state.body} 
                            onChange={this.handleChange} fullWidth  multiline rows="3" />

                            <Button className={classes.button}  type="submit" variant="contained" color="primary">Submit</Button>
                        </form>    
                    </article>              
                </article>
        } else {
            commentFormMarkup = 
                <article className={classes.commentForm}>
                    <hr className={classes.divider}/>

                    <article className={classes.loginBox}>
                        <Typography className={classes.loginText} variant="body1">You must be logged in to comment</Typography>
                        <Button className={classes.loginButton} component={Link} to={`/login`} type="submit" variant="contained" color="primary">Login</Button>
                    </article>

                </article>
        }

        return commentFormMarkup; 
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired, 
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired, 
    TweetId: PropTypes.string.isRequired, 
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    UI: state.UI, 
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm)); 
