import React, { Component } from 'react'
import PropTypes from 'prop-types'; 
import axios from 'axios'; 
import Link from 'react-router-dom/Link'; 

// MUI 
import Grid from '@material-ui/core/Grid'

// Redux  
import { connect } from 'react-redux'; 
import { getUserData } from '../redux/actions/dataActions'; 

// Components 
import Tweet from '../components/tweet/Tweet'; 
import StaticProfile from '../components/profile/StaticProfile';
import { CircularProgress, Paper, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button'; 

// Styling 
import '../style/user.css'
import { profile } from './profile';


export class user extends Component {

    state = {
        profile: null,
        error: null
    }

    componentDidMount() {
        // get the ID sendt
        const user = this.props.match.params.userID; 
        
        // Get the tweets of the user
        this.props.getUserData(user); 

        // Get the details of the user 
        axios.get(`/user/${user}`)
            .then(res => {
                this.setState({
                    profile: res.data.user,
                });
                
            }).catch((err) => {
                this.setState({
                    error: err.response.data
                })
                console.log(err.response.data)
            }); 
    }

    render() {
        document.title="Tweetify - User";
        const { tweets, loading } = this.props.data; 
        const { error } = this.state; 
        const { user } = this.props.user; 

        if ( user.ID === this.props.match.params.userID ) {
            this.props.history.push(`/profile/${this.props.match.params.userID}`); 
        }
        
        let userMarkup; 

        if (!error) {

            // Loop through the tweets 
            let TweetsMarkup = null; 

            if (!loading) {

                 // create the markup for the user
                userMarkup = 
                <Grid container direction="column" alignItems="center" justify="center" spacing={3}>
                    <Grid item sm={8} xs={12}>
                        {this.state.profile === null ? (
                            <p><CircularProgress /></p>
                        ) : (<StaticProfile profile={this.state.profile} />)}
                    </Grid>

                    <Grid item sm={8} xs={12}>
                        <Typography variant="h5" paddingBottom="10px" color="primary">Tweets posted</Typography>
                        {TweetsMarkup}
                    </Grid>
                </Grid>

                if (tweets === null) {
                    <p>This user has not made any tweets yet.</p>
                } else {
                    TweetsMarkup = tweets.map(tweet => <Tweet key={tweet.TweetId} tweet={tweet} />);
                }

            } else {
                TweetsMarkup = <CircularProgress />
            }

            // create the markup for the user
            userMarkup = 
                <Grid container direction="column" alignItems="center" justify="center" spacing={3}>
                    <Grid item sm={8} xs={12}>
                        {this.state.profile === null ? (
                            <p><CircularProgress /></p>
                        ) : (<StaticProfile profile={this.state.profile} />)}
                    </Grid>

                    <Grid item sm={8} xs={12}>
                        <Typography variant="h5" paddingBottom="10px" color="primary">Tweets posted</Typography>
                        {TweetsMarkup}
                    </Grid>
                </Grid>
        } else {
            userMarkup = 
                <Grid container direction="column" alignItems="center" justify="center" xs={12}>
                    <Paper className="not-found">
                        <Typography variant="h5">{error.error}</Typography>
                        <Button className="not-found-btn" variant="contained" color="primary" component={Link} to="/">Go back</Button>
                    </Paper>
                </Grid>        
        }
      
        return userMarkup;
    }
}

user.propTypes = {
    user: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired, 
    data: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    data: state.data
})

export default connect(mapStateToProps, {getUserData})(user); 
