import React from 'react';  
import { useDispatch } from "react-redux";
import { deletePost } from '../../actions/post.action';

const DeleteCard = (props) => {
    const dispatch = useDispatch();

    const deleteQuote = () => dispatch(deletePost(props.post._id))  

    return (
        <div onClick={() => {
            if(window.confirm('Voulez-vous vraiment supprimer cet article ?'))
            { deleteQuote() }
        }}>
            <img src="./img/icons/trash.svg" alt="trash"/>
        </div>
    )}

export default DeleteCard;
