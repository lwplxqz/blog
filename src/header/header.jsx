
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Avatar } from 'antd';
import { setToken, setLoggedUserData } from '../store/loginSlice';

import './header.scss'
import { useGetLoggedUserQuery } from '../store/postsApi';


function Header() {

    const noImage = 'https://static.productionready.io/images/smiley-cyrus.jpg'

    const apiKey = useSelector(store => store.login.token)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [userData, setUserData] = useState(undefined)

    const localApiKey = localStorage.getItem('token')

    const token = apiKey || localApiKey

    const {
        data: loggedData,

        isLoading
    } = useGetLoggedUserQuery(token, {
        skip: !token
    })



    useEffect(() => {
        if (loggedData) {
            setUserData(loggedData)
            dispatch(setLoggedUserData({
                username: loggedData.user.username,
                email: loggedData.user.email
            }))
        }
    }, [loggedData])

    const logOut = () => {
        localStorage.removeItem('token')
        dispatch(setToken(undefined))
        setUserData(undefined)
        navigate('/articles')
    }

    const headerInformation = userData ? <>
        <Link className="header_create-article" to='/new-article'>Create article</Link>
        <Link to='/profile' className='header_user-info'>
            <div className="header_username">{userData.user.username}</div>
            <Avatar src={userData.user.image || noImage} size={46} />
        </Link>
        <button type="button" className='header_logout' onClick={() => logOut()}>Log out</button>
    </>
        : (<>
            <Link to='/sign-in' className='header_sign-in'>Sign In</Link>
            <Link to='/sign-up' className='header_sign-up'>Sign Up</Link>
        </>)

    return (
        <header className='header'>
            <h1 className="header_title">
                <Link to='articles'>
                    RealWorld Blog
                </Link>
            </h1>
            <div className="header_button-wrapper">
                {isLoading ? <Spin /> : headerInformation}
            </div>
        </header>
    );
}

export default Header;