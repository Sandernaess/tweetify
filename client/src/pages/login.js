import React, { Component } from 'react'; 
import PropTypes from 'prop-types';
import icon from '../images/tweetify.svg';
import { Link } from 'react-router-dom';

// Redux 
import { connect } from 'react-redux'; 
import { loginUser } from '../redux/actions/userActions'; 

// MUI 
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import '../style/login.css'; 

import { withStyles } from '@material-ui/core/styles';

// Redux 


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


class login extends Component {

    constructor() {
        super(); 
        this.state = {
            email: '',
            password: '',
            loading: false,
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

        const userData = {
            email: this.state.email, 
            password: this.state.password
        }; 

        this.props.loginUser(userData, this.props.history); 

    }

    render() {
        document.title="Tweetify - Login";
        const { classes, UI: { loading } } = this.props; 
        const { errors } = this.state; 

        return (
            <Paper className="auth-form">   

                <div className="auth-form-top">
                    <img className="logo" src={icon} alt="tweet emoji" />
                    <Typography variant="h2">Login</Typography>
                    <Typography variant="subtitle1">Login to an existing account</Typography>
                </div>

                <form noValidate onSubmit={this.handleSubmit}>
                
                    <TextField className={classes.input}  id="email" name="email" type="email" helperText={errors.email} error={errors.email ? true : false}
                    label="Email" value={this.state.email} onChange={this.handleChange} fullWidth />

                    <TextField className={classes.input} id="password" name="password" type="password" helperText={errors.password} error={errors.password ? true : false}
                    label="Password" value={this.state.password} onChange={this.handleChange} fullWidth />


                    {errors.general && (
                        <Typography className={classes.error} variant="body2"> {errors.general} </Typography>
                    )}

                    <Button className={classes.btn} type="submit" variant="contained" color="primary">Login</Button>

                    <small>Dont have an account? Sign up <Link to="/signup">here</Link></small>
                </form>

                {loading && (<CircularProgress className={classes.spinner} />)}

            </Paper>
        )
    }
}


login.propTypes = {
    classes: PropTypes.object.isRequired, 
    loginUser: PropTypes.object.isRequired, 
    user: PropTypes.object.isRequired, 
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user, 
    UI: state.UI
})

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login)); 