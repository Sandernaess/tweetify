import React, { Component } from 'react'; 
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';
import moment from 'moment'; 

// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'; 

// Icons
import ChatIcon from '@material-ui/icons/Chat';


// styling 
import '../../style/tweet.css';
import PropTypes from 'prop-types'; 

// Redux 
import { connect } from 'react-redux'; 

// Components 
import DeleteTweet from './DeleteTweet'; 
import TweetDialog from './TweetDialog'; 
import LikeButton from './LikeTweet'; 


const styles = {
    card: {
        display: 'flex'
    }, 
    cardImage: {
        height: "100px", 
        width: "100px"
    }

}

export class Tweet extends Component {


    render() {
        const {
            tweet,
            user: {
                user: {
                    name,
                    ID
                }
            }
        } = this.props; 


        let owner = false; 
        // get the counts for likes and comments 
        let deleteButton = null; 
        let likeCount = tweet.likeCount;
        let commentCount = tweet.commentCount;  
        let profileLink; 
        
        // check if owner of the tweet
        if (tweet.creatorID === ID) {
            owner = true; 
        }

        if (owner) {
            deleteButton = <DeleteTweet TweetId={tweet.TweetId} />
            profileLink = `/profile/${ID}`; 
        } else {
            profileLink = `/users/${tweet.creatorID}`; 
        }
    
        return (
            <Card className="card">
                <CardMedia image={tweet.userImage} title="Profile image" className="card-image" />

                <CardContent>
                    <Typography variant="h5" component={Link} to={profileLink} color="primary"> @{tweet.handle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{moment(tweet.createdAtText).fromNow()}</Typography>
                    <Typography variant="body1">{tweet.body}</Typography>

                    <div className="tweet-buttons">
                        
                        <LikeButton TweetId={tweet.TweetId} />
                        <span>{likeCount} likes</span>
                        
                        <Tooltip title="comments" placement="right-start">
                            <IconButton><ChatIcon color="primary" /> </IconButton>
                        </Tooltip> 
                        <span>{commentCount} comments</span>

                        <TweetDialog TweetId={tweet.TweetId} user={tweet.user} />
                    </div>

                </CardContent>
            </Card>
        );
    }
}

Tweet.propTypes = {
    user: PropTypes.object.isRequired, 
    tweet: PropTypes.object.isRequired, 
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
}); 


export default connect(mapStateToProps)(withStyles(styles)(Tweet)); 