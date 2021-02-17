import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getPosts } from '../../actions/post.action';
import { isEmpty, timestampParser } from '../../utils/utils';
import FollowHandler from '../Profil/FollowHandler';
import EditDeleteComment from './EditDeleteComment';

const CardComment = ({ post }) => {
    const [text, setText] = useState('');
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleComment = (e) => {
        e.preventDefault();
        if (text) {
            dispatch(addComment(post._id, userData._id, text, userData.pseudo))
                .then(() => dispatch(getPosts()))
                .then(() => setText(''));
        }
    }

    return (
        <div className="comments-container">
            {post.comments.map((comment) => {
                return (
                    <div key={comment._id} className={comment.commenterId === userData._id ?
                        "comment-container client" : "comment-container"}>
                        <div className="left-part">
                            <img src={!isEmpty(usersData[0]) &&
                                usersData
                                    .map((user) => {
                                        if (user._id === comment.commenterId) return user.picture;
                                        else return null;
                                    })
                                    .join('')
                            } alt="commenter-pic" />
                        </div>
                        <div className="right-part">
                            <div className="comment-header">
                                <div className="pseudo">
                                    <h3>{comment.commenterPseudo}</h3>
                                    {comment.commenterId !== userData._id && (
                                        <FollowHandler idToFollow={comment.commenterId} type={'card'} />
                                    )}
                                </div>
                                <span>{timestampParser(comment.timestamp)}</span>
                            </div>
                            <p>{comment.text}</p>
                            <EditDeleteComment comment={comment} postId={post._id}/>
                        </div>
                    </div>
                );
            })}
            {userData._id && (
                <form action="" onSubmit={handleComment} className="comment-form">
                    <input type="text" name="text" value={text} placeholder="Laisser un commentaire" onChange={(e) => setText(e.target.value)} />
                    <br />
                    <input type="submit" value="envoyer" />
                </form>
            )}
        </div>
    )
}

export default CardComment;
