
import React, { Component } from 'react'
import PropTypes from 'prop-types'; 

// MUI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 

// Components 
import Profile from '../components/profile/Profile';
import ProfileTweets from '../components/tweet/ProfileTweets'; 
import Tweet from '../components/tweet/Tweet';

// Redux 
import { connect } from 'react-redux'; 
import { getUserData } from '../redux/actions/dataActions'; 


// Styling 
import '../style/user.css'
import { CircularProgress } from '@material-ui/core';

export class profile extends Component {

    state = {
        userID: ''
    }
 
    componentDidMount() {

        // get the ID sendt
        const user = this.props.match.params.userID; 

        // Get the tweets of the user
        this.props.getUserData(user); 
    }

    render() {
        document.title="Tweetify - Profile";
        const { tweets, loading } = this.props.data; 
        const { authenticated, user: { ID } } = this.props.user

        let TweetsMarkup = null; 
        let profileMarkup = null; 

        if (!loading) {
            
            // Check if ID given is correct
            if (authenticated && ID === this.props.match.params.userID) {

                profileMarkup = <Profile />

                // Check the tweets made
                if (tweets === undefined || tweets.length == 0) {
                    TweetsMarkup = <p>You have not posted any tweets</p>
                } else {
                    TweetsMarkup = tweets.map(tweet => <Tweet key={tweet.TweetId} tweet={tweet} />);
                }

            } else {
                // Not own profile, redirect to viewing other profiles
                this.props.history.push(`/users/${this.props.match.params.userID}`); 
            }

        } else {
            TweetsMarkup = <CircularProgress />
        }

        return (

            <Grid container direction="column" alignItems="center" justify="center" spacing={3}>
                <Grid item sm={8} xs={12}>
                    {profileMarkup}
                </Grid>

                <Grid item sm={8} xs={12}>
                    <Typography variant="h5" paddingBottom="10px" color="primary">Tweets posted</Typography>
                    {TweetsMarkup}
                </Grid>
            </Grid>
        )
    }
}

profile.propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.func.isRequired,
    getUserData: PropTypes.func.isRequired, 
}

const mapStateToProps = state => ({
    user: state.user,
    data: state.data
})

export default connect(mapStateToProps, {getUserData})(profile); 
