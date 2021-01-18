import React, { Component } from 'react'; 
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom'; 
import moment from 'moment'; 

// MUI 
import Button from '@material-ui/core/Button'; 
import Dialog from '@material-ui/core/Dialog'; 
import CircularProgress from '@material-ui/core/CircularProgress'; 
import Typography from '@material-ui/core/Typography'; 

// Icons 
import CloseIcon from '@material-ui/icons/Close'; 
import UnfoldMore from '@material-ui/icons/UnfoldMore'; 
import ChatIcon from '@material-ui/icons/Chat'; 

// Redux 
import { connect } from 'react-redux'; 
import { getTweet, clearErrors } from '../../redux/actions/dataActions'; 
import { DialogContent, IconButton, Tooltip } from '@material-ui/core';


// Components 
import LikeButton from './LikeTweet';
import Comments from './Comments'; 
import CommentForm from './TweetForm'; 

const styles = {
    img: {
        maxWidth: '200px', 
        height: '200px', 
        borderRadius: '50%', 
        objectFit: 'cover'
    },
    DialogContent: {
        padding: '20px'
    }, 
    dialogInfo: {
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap'
    }, 
    TweetImage: {
        width: '40%'
    }, 
    TweetInfo: {
        width: '60%'
    },
    closeBtn: {
        position: 'absolute', 
        left: '86%'
    }, 
    loadingProgress: {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px'
    },
    date: {
        marginBottom: '10px'
    },
    dialogButtons: {
        marginTop: '10px'
    }
}

class TweetDialog extends Component {
    state = {
        open: false, 
    }; 

    componentDidMount() {
        if (this.props.openDialog) {
          this.handleOpen();
        }
    }

    handleOpen = () => {
        this.setState({ open: true });

        //get the tweet data when the dialog has been opened 
        this.props.getTweet(this.props.TweetId); 
        console.log('TweetID: ', this.props.TweetId);
    }

    handleClose = () => {
        this.setState({ open: false}); 
        this.props.clearErrors(); 
    }

    render() {

        const { 
            classes, 
            tweet, 
            UI: { loading } 
        } = this.props

        console.log(tweet.body);

        let dialogMarkup; 

        if (loading) {
            dialogMarkup = <div className={classes.loadingProgress}><CircularProgress size={100} /></div>
        } else {
            // Make the markup for the dialog 
            dialogMarkup = 
            <section className={classes.dialogInfo}>

                <article className={tweet.TweetImage}>
                    <img className={classes.img} src={tweet.userImage} alt="profile" />
                </article>

                <article className={classes.TweetInfo}>
                    <Typography 
                    component={Link} color="primary" variant="h5" 
                    to={`/users/${tweet.creatorID}`}>@{tweet.handle} </Typography>

                    <Typography className={classes.date} variant="body2" color="textSecondary">{moment(tweet.createdAtText).fromNow()} - {moment(tweet.createdAtText).format('DD.MM.YYYY')} </Typography>

                    <Typography variant="body1">{tweet.body}</Typography>

                    <article className={classes.dialogButtons}>
                        <LikeButton TweetId={tweet.TweetId} />
                        <span>{tweet.likeCount} likes</span>

                        <Tooltip title="comments" placement="right-start">
                            <IconButton><ChatIcon color="primary" /></IconButton>
                        </Tooltip> 
                        <span>{tweet.commentCount} comments</span>
                    </article>

                </article>

                <CommentForm TweetId={tweet.TweetId} />
                
                <Comments comments={tweet.comments} />     
            </section>
        }

        return (
            <div>
                <Tooltip title="Expand tweet">
                    <Button className={classes.expandBtn} onClick={this.handleOpen}><UnfoldMore color="primary" /></Button>
                </Tooltip>


                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <Tooltip title="Close" placement="top">
                        <Button onClick={this.handleClose} className={classes.closeBtn}><CloseIcon /></Button>
                    </Tooltip>

                    <DialogContent className={classes.DialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </div>


        )
    }
}

TweetDialog.propTypes = {
    getTweet: PropTypes.func.isRequired, 
    TweetId: PropTypes.string.isRequired, 
    user: PropTypes.string.isRequired, 
    tweet: PropTypes.object.isRequired, 
    UI: PropTypes.object.isRequired, 
    clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    tweet: state.data.tweet, 
    UI: state.UI
}); 

const mapActionsToProps = {
    getTweet, 
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TweetDialog));



