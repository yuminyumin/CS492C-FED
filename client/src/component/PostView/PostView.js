/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import { request } from '../../utils/axios';
import { 
  CommentContainer, 
  ContentContainer, 
  InfoContainer, 
  MainContainer, 
  PostHeaderContainer, 
  ReactContainer, 
  TitleContainer, 
  UnderTitleContainer,
  LikeButton,
 } from './styled';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../Header';
import MDEditor from '@uiw/react-md-editor';
import { useHistory } from 'react-router';
import { InputContainer } from './styled';
import { editPost, like, unlike, getLikedPosts } from '../../actions/actions';
import Comment from '../../component/Comment/Comment';
const POST_URL = '/api/post';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:80/');
 
const PostView = ({ match }) => {
  const _loginUser = useSelector(state => state.user.loginUser);
  const _postList = useSelector(state => state.user.postList);
  const { no } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  const _likedPostList = useSelector(state => state.user.likedPostList);
  const data = _postList.find((element) => {
    return element[1] == no
  });
  const [title, setTitle] = useState(data[2]);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(data[8]);
  const [active, setActive] = useState(false);
  
  const clickEdit = () => {
    setEdit(true);
  };
  const cancle = () => {
    setEdit(false);
  };
  const writeTitle = e => {
    setTitle(e.target.value);
  };
  const editContent = () => {
    const created_date = new Date();
    let body = {
        postNO : data[1],
        title: title,
        no_comments: data[3],
        likes: data[4],
        userID: data[5],
        created_date: created_date,
        view: data[7],
        content: content,
        likeUsers: data[9],
    }
    dispatch(editPost(body));
    console.log(body);
    history.push('/postMain');
  };

  const toPostList = () => {
    history.push('/postMain');
  };

  const deletePost = () => {
    let body = {
      postNO : data[1],
    }
    request('post', POST_URL + '/deletePost', body)
    history.push('/postMain');
  }

  const clickLike = () => {
    let body = {
      postNO: data[1],
      userID: _loginUser['userID'],
    }
    if (!active) {
      // dispatch(like(body));
      console.log('dispatch like');
      socket.emit('like-snd', body);
    } else {
      // dispatch(unlike(body));
      console.log('dispatch unlike');
      socket.emit('unlike-snd', body);
    }
    // setActive(!active);
  };
  // let body = {
  //   postNO: data[1],
  //   userID: data[5],
  // }
  // dispatch(getLikedPosts(body));
  
  // useEffect(() => {
  //   let body = {
  //     postNO: data[1],
  //     userID: data[5],
  //   }
  //   dispatch(getLikedPosts(body));
  //   for (var i = 0; i < _likedPostList.length; i++) {
  //     if (data[1] == _likedPostList[i]) {
  //       setActive(true);
  //       console.log('already liked');
  //       break;
  //     }
  //   }
  // }, [_likedPostList]);

  useEffect(() => {
    // console.log(_loginUser['userID']);
    const islike = data[9].find((element) => {
      if(element === _loginUser['userID']) {
        return true;
      }
    })
    if (islike == _loginUser['userID']) {
      setActive(true);
    } else {
      setActive(false);
    }
    console.log('liked users : ' + data[9]);
    socket.on('like-rcv', item => {
      setActive(true);
    });
    socket.on('unlike-rcv', item => {
      setActive(false);
    });
  }, []);
 
  return (
    <MainContainer>
      <Header />
      <PostHeaderContainer>
        { edit ? 
          <TitleContainer>
            <InputContainer 
                placeholder="제목을 입력하세요"
                onChange={writeTitle}
                value={title}
            /> 
          </TitleContainer>
          : <TitleContainer>{data[2]}</TitleContainer>}
        <UnderTitleContainer>
          <InfoContainer>postNO : {data[1]}</InfoContainer>
          <InfoContainer>writer: {data[5]}</InfoContainer>
          <InfoContainer>{data[6]}</InfoContainer>
          <InfoContainer>views: {data[7]}</InfoContainer>
          {edit ?<button onClick={editContent}>등록</button>
          : <button onClick={clickEdit}>수정</button>}
          {edit ? <button onClick={cancle}>취소</button> : null}
          {!edit ? <button onClick={deletePost}>삭제</button> : null}
        </UnderTitleContainer>
      </PostHeaderContainer>
      <ContentContainer>
        {edit ? 
        <MDEditor
          height={400}
          value={content}
          onChange={setContent}
        /> : <MDEditor.Markdown source={data[8]} />}
      </ContentContainer>
      <ReactContainer>
        <InfoContainer>likes : {data[4]}</InfoContainer>
        <InfoContainer>no_comments: {data[3]}</InfoContainer>
        <LikeButton 
          onClick={clickLike}
          active={active}
        >
          like
        </LikeButton>
        <button onClick={toPostList}>목록으로</button>
      </ReactContainer>
      <CommentContainer>
        <Comment postNo={data[1]}/>
      </CommentContainer>
    </MainContainer>
  )
}
 
export default PostView;