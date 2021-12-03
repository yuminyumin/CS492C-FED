import React from 'react';
import { Text, HeaderContainer, Btn, BtnContainer, UserInfo } from './styled';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { userLogined } from '../../actions/actions';

const Header = () => {
    const history = useHistory();
    const _loginUser = useSelector(state => state.user.loginUser);
    const dispatch = useDispatch();
    const backtoMain = () => {
        history.push('/postMain/1');
    }
    const goMyPage = () => {
        history.push('/myPage/myPosts/1');
    }
    const logout = () => {
        dispatch(userLogined({}));
        history.push('/');
    }
    return (
        <HeaderContainer>
            <Text onClick={backtoMain}>Board</Text>
            <BtnContainer>
                {window.location.href.includes('postMain') ? null : <Btn onClick={backtoMain}>목록으로</Btn>}
                <Btn onClick={goMyPage}>MyPage</Btn>
                <Btn onClick={logout}>Logout</Btn>
                <UserInfo>{_loginUser.userID}</UserInfo>
            </BtnContainer>
        </HeaderContainer>
    )
}

export default Header;