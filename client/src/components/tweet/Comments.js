import React, { Component } from 'react'; 
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom'; 
import moment from 'moment';

// MUI 
import Typography from '@material-ui/core/Typography'; 


const styles = {
    commentSection: {
        width: '100%'
    },
    comment: {
        display: 'flex',
        marginTop: '20px',
    }, 
    image: {
        width: '21%'
    },
    commentImage: {
        width: '100px',
        height: '100px', 
        borderRadius: '50%', 
    },
    commentData: {
        width: '70%'
    },
    date: {
        marginBottom: '5px'
    }
}



export class Comments extends Component {
    render() {

        const { comments, classes } = this.props; 

        return (
            <section className={classes.commentSection}>
                
                {comments.map((comment) => {
                    const { body, createdAt, userImage, user, createdAtText } = comment; 
                    return (
                        <article key={createdAt}>
                            <hr />
                            <div className={classes.comment}>
                                <div className={classes.image}>
                                    <img src={userImage} alt="comment" className={classes.commentImage} />
                                </div>

                                <div className={classes.commentData}>
                                    <Typography variant="h5" component={Link} to={`users/${user}`} color="primary">{user}</Typography>
                                    <Typography className={classes.date} variant="body2" color="textSecondary">{moment(createdAtText).fromNow()}</Typography>

                                    <Typography variant="body1">{body}</Typography>                             
                                </div>
                            </div>

                        </article>
                    )
                })}

                
            </section>
        )
    }
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired
}


export default withStyles(styles)(Comments);
