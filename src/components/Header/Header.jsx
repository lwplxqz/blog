
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Avatar } from 'antd';
import { setToken, setLoggedUserData } from '../../store/loginSlice';
import { noImage, token as localToken } from '../../const';
import styles from './Header.module.scss'
import { useGetLoggedUserQuery } from '../../store/postsApi';


function Header() {

    const apiKey = useSelector(store => store.login.token)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [userData, setUserData] = useState(undefined)

    const token = apiKey || localToken

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
        localStorage.removeItem('loggedUser')
        dispatch(setToken(undefined))
        setUserData(undefined)
        navigate('/articles')
    }

    const headerInformation = userData ? <>
        <Link className={styles['header_create-article']} to='/new-article'>Create article</Link>
        <Link to='/profile' className={styles['header_user-info']}>
            <div className={styles.header_username}>{userData.user.username}</div>
            <Avatar src={userData.user.image || noImage} size={46} />
        </Link>
        <button type="button" className={styles.header_logout} onClick={() => logOut()}>Log out</button>
    </>
        : (<>
            <Link to='/sign-in' className={styles['header_sign-in']}>Sign In</Link>
            <Link to='/sign-up' className={styles['header_sign-up']}>Sign Up</Link>
        </>)

    return (
        <header className={styles.header}>
            <h1 className={styles.header_title}>
                <Link to='articles'>
                    RealWorld Blog
                </Link>
            </h1>
            <div className={styles["header_button-wrapper"]}>
                {isLoading ? <Spin /> : headerInformation}
            </div>
        </header>
    );
}

export default Header;