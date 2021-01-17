import React, { Component } from 'react'
import logo from '../images/tweetify.svg'; 
import Link from 'react-router-dom/Link'; 
import withStyles from '@material-ui/core/styles/withStyles'; 

// MUI 
import Typography from '@material-ui/core/Typography'; 
import Paper from '@material-ui/core/Paper'
import { Button } from '@material-ui/core';



const styles = {
    
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },

    logo404: {
        marginTop: '20px',
        width: '150px',
        height: '150px'
    },

    topText: {
        marginTop: '10px'
    },

    button404: {
        margin: '20px 0px'
    }

}

class page404 extends Component {

    render() {
        document.title="Tweetify - Not found";
        const { classes } = this.props; 

        return (
            <Paper className={classes.content}>
                <img className={classes.logo404} src={logo} alt="page not found" />
                <Typography className={classes.topText} variant="h2">404</Typography>
                <Typography variant="body1">Sorry, the page you were looking for does not exist.</Typography>

                <Button className={classes.button404} color="primary" variant="contained" component={Link} to="/">Go back</Button>
            </Paper>
        )
    }
}

export default withStyles(styles)(page404); 
