import React, { Component } from 'react'; 
import Grid from '@material-ui/core/Grid'; 
import PropTypes from 'prop-types';  

import Tweet from '../components/tweet/Tweet';
import Profile from '../components/profile/Profile'; 
import '../style/home.css';

// Redux 
import { connect } from 'react-redux';
import { getTweets } from '../redux/actions/dataActions.js'; 

// Styling 
import '../style/home.css'; 
import Sidebar from '../components/layout/Sidebar';

export class home extends Component {

    // when ready, get the tweets from the db
    componentDidMount() {
      this.props.getTweets();
    }

    render() {
        document.title="Tweetify - Home";

        const { tweets, loading } = this.props.data; 

        let recentTweetsMarkup = null; 
        
        if (!loading) {
            recentTweetsMarkup = tweets.map(tweet => <Tweet key={tweet.TweetId} tweet={tweet}/>); 
        }
        
        return (
            <Grid className="home-container" container m={14}>
            
              <Grid className="profile-grid" item md={4} sm={10} xs={12}>
                <Sidebar />
              </Grid>

              <Grid className="home-grid" item md={6} sm={10} xs={12}>
                  {recentTweetsMarkup}
              </Grid>
                
            </Grid>
        )
    }
}


home.propTypes = {
    getTweets: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };
  
  const mapStateToProps = (state) => ({
    data: state.data
  });

export default connect(
    mapStateToProps,
    { getTweets }
  )(home);