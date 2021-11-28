import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { CommentContainer/*, RowContainer */} from './styled';
const socket = io.connect('http://localhost:80/');
 
// eslint-disable-next-line react/prop-types
const MyCommentRow = ({ comment }) => {
  const _myPostList = useSelector(state => state.user.myCommentList);
  const _postNO = comment[3];
  const clickpost = () => {
    let item = {
      postNO: _postNO,
    }
    socket.emit('post-click-snd', item);
  }
  console.log(_myPostList)
  console.log(_postNO)
  const thispost = _myPostList.find((element) => {
      if (element[3] === _postNO) {
          return true;
      }
  })
  
  return (
    <>
        <tr>
            <td>{thispost[3]}</td>
            <td>
                <Link to={`/postView/${thispost[1]}`} onClick={clickpost}>{thispost[2]}({thispost[3]})</Link>
            </td>
            <td>{thispost[4]}</td>
            <td>{thispost[5]}</td>
            <td>{thispost[6]}</td>
            <td>{thispost[7]}</td>
        </tr>
        <tr>
            <td align="center" colSpan='6'>
            <CommentContainer>{comment[2]}</CommentContainer>
            </td>
        </tr>
    </>
  )
}
 
export default MyCommentRow;