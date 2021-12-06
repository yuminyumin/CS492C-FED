/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import SingleComment from '../../component/SingleComment/SingleComment';
import { CommentContainer, RepliesContainer, CommentListsContainer, SubmitButton } from './styled';
const { TextArea } = Input;

function Comments({ postNO, _onSubmit, isStory }) {
    const user = useSelector(state => state.user.loginUser)

    const [Comment, setComment] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const userID = user.userID
    // const postNO = props.postNO
    const created_date = moment().format("YYYY년 MM월 DD일 HH시 mm분");

    const handleClick = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        if(isStory === true) return _onSubmit(e);

        else {
            e.preventDefault();
            console.log('submit');
            if (Comment != '') {
                if (Comment.length >= 1000) {
                    alert('댓글 길이는 1000byte 이하여야 합니다')
                } else {
                    const variables = {
                        content: Comment,
                        postNO: postNO,
                        writer: userID,
                        created_date: created_date,
                    }
                    axios.post('/api/comment/saveComment', variables)
                        .then(response => {
                            if (response.data.success) {
                                console.log(response.data.result)
                                setComment([])
                                window.location.replace(window.location.href);
                            } else {
                                alert('Failed to save Comment')
                            }
                        }
                    );
                }
            }
        }
    }

    useEffect(()=>{
        const variables = {
            postNO: postNO,
        }
        if(isStory !== true) {
        axios.post('/api/comment/getComments', variables)
            .then(response => {
                console.log(Object.values(response));
                if (response.data.success) {
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
            })
        }
    },[]);
    
    return (
        <CommentContainer>
            <RepliesContainer>댓글</RepliesContainer>
            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={Comment}
                    placeholder="댓글 입력"
                />
                <br />
                <SubmitButton onClick={onSubmit}>Submit</SubmitButton>
            </form>
            {/* Comment Lists  */}
            <CommentListsContainer>
                {CommentLists.map((comment) => (
                    <SingleComment 
                        key={comment._id} 
                        comment={comment}
                        postNO={postNO}
                    />
                ))}
            </CommentListsContainer>
        </CommentContainer>
    )
}

export default Comments
