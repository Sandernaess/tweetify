import React, { Component } from 'react'; 
import icon from '../images/tweetify.svg';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


// UI
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../style/signup.css'; 

import { withStyles } from '@material-ui/core/styles';

// Redux 
import { connect } from 'react-redux'; 
import { signupUser } from '../redux/actions/userActions'; 
import { Paper } from '@material-ui/core';


// styling for MUI 
const styles = {
    btn: {
        marginTop: "20px", 
        marginBottom: "15px"
    },

    input: {
        margin: "6px 0px"
    },

    error: {
        color: "red",
        marginTop: "10px", 
        fontSize: "0.8rem"
    },

    spinner: {
        marginTop: "10px"
    }
};


class signup extends Component {
       
    constructor() {
        super(); 
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            handle: '',
            errors: {}
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault(); 

        // start the loading
        this.setState({
            loading: true
        }); 

        // get the data given
        const userData = {
            email: this.state.email, 
            password: this.state.password, 
            confirmPassword: this.state.confirmPassword,
            name: this.state.name, 
            handle: this.state.handle, 
        };

        this.props.signupUser(userData, this.props.history);
        
    };

    render() {
        document.title="Tweetify - Signup";
        const { classes, UI: { loading } } = this.props; 
        const { errors } = this.state; 

        return (
            <Paper className="auth-form">
                <div className="auth-form-top">
                    <img className="logo" src={icon} alt="tweet emoji" />
                    <Typography variant="h2">Sign Up</Typography>
                    <Typography variant="subtitle1">Sign up for an account for free</Typography>
                </div>

                <form noValidate onSubmit={this.handleSubmit}>

                    <TextField className={classes.input}  id="name" name="name" type="text" helperText={errors.name} error={errors.name ? true : false}
                    label="Your name" value={this.state.name} onChange={this.handleChange} fullWidth />

                    <TextField className={classes.input}  id="email" name="email" type="email" helperText={errors.email} error={errors.email ? true : false}
                    label="Email" value={this.state.email} onChange={this.handleChange} fullWidth />

                    <TextField className={classes.input} id="password" name="password" type="password" helperText={errors.password} error={errors.password ? true : false}
                    label="Password" value={this.state.password} onChange={this.handleChange} fullWidth />

                    <TextField className={classes.input} id="confirmPassword" name="confirmPassword" type="password" helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false}
                                        label="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange} fullWidth />

                    <TextField className={classes.input} id="handle" name="handle" type="text" helperText={errors.handle} error={errors.handle ? true : false}
                                        label="Handle" value={this.state.handle} onChange={this.handleChange} fullWidth />

                    {errors.general && (
                        <Typography className={classes.error} variant="body2"> {errors.general} </Typography>
                    )}

                    <Button className={classes.btn} type="submit" variant="contained" color="primary">Signup</Button>

                    <small>Already an account? Login <Link to="/login">here</Link></small>
                </form>

            </Paper>
        );
    }
    
}


signup.propTypes = {
    classes: PropTypes.object.isRequired, 
    user: PropTypes.object.isRequired, 
    UI: PropTypes.object.isRequired, 
    signupUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user, 
    UI: state.UI
}); 



export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup)); 