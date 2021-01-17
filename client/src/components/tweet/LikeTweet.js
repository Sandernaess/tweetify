import React, { Component } from 'react'
import { Link } from 'react-router-dom'; 
import PropTypes from 'prop-types'; 

// MUI Stuff
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'; 


// Icons 
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';  
import Favorite from '@material-ui/icons/Favorite';  


// Redux 
import { connect } from 'react-redux'; 
import { likeTweet, unlikeTweet } from '../../redux/actions/dataActions'; 


export class LikeButton extends Component {
    
    likedTweet = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.TweetId === this.props.TweetId)) {
            return true; 
        } else {
            return false; 
        }
    }; 

    likeTweet = () => {
        console.log("ID: ", this.props.TweetId); 
        this.props.likeTweet(this.props.TweetId); 
    };

    unlikeTweet = () => {
        this.props.unlikeTweet(this.props.TweetId); 
    };
    
    render() {

        const { authenticated } = this.props.user

        // Create the like button according to the auth state
        let likeButton; 

        // if not, make a button that redirects to login 
        if (!authenticated) {
            likeButton = 
            <Tooltip title="like" placement="right-start">
                <IconButton component={Link} to="/login"><FavoriteBorder color="primary" /> </IconButton> 
            </Tooltip>   
        } else {

            // if already liked, make a button to undo like
            if (this.likedTweet()) {
                likeButton = 
                <Tooltip title="Undo like" placement="right-start">
                    <IconButton onClick={this.unlikeTweet}><Favorite color="primary" /> </IconButton> 
                </Tooltip> 
            } else {

                // if not liked, make a button to like the tweet 
                likeButton = 
                <Tooltip title="like" placement="right-start">
                    <IconButton onClick={this.likeTweet}><FavoriteBorder color="primary" /> </IconButton> 
                </Tooltip>  
            }
        }

        return likeButton; 
    }
}

likeTweet.propTypes = {
    user: PropTypes.object.isRequired, 
    TweetId: PropTypes.string.isRequired, 
    likeTweet: PropTypes.func.isRequired,
    unlikeTweet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeTweet, 
    unlikeTweet
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton); 
