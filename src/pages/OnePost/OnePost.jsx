
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tag, Avatar, Spin } from 'antd';
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useGetOnePostQuery, useGetLoggedUserQuery, useDeletePostMutation, useSwitchFavoriteMutation } from '../../store/postsApi';
import stylesHeader from "../../components/Post/Post.module.scss"
import styles from "./OnePost.module.scss"
import LikeButton from '../../shared/LikeButton';


function OnePost() {
    const localApiKey = localStorage.getItem('token')

    const apiKey = useSelector(store => store.login.token)
    const token = apiKey || localApiKey

    const { slug } = useParams()
    const { data, isLoading } = useGetOnePostQuery({ slug, token })
    const [switchFavorite] = useSwitchFavoriteMutation()


    const navigate = useNavigate()

    const [isPopupVisible, setIsPopupVisible] = useState(false)



    const {
        data: loggedData,

        isLoading: isLoggedLoading
    } = useGetLoggedUserQuery(token, {
        skip: !token
    })

    const [deletePost, { isSuccess: deleteSuccess }] = useDeletePostMutation()

    useEffect(() => {
        if (deleteSuccess) {
            navigate('/articles')
        }
    }, [deleteSuccess])

    if (isLoading || isLoggedLoading) {
        return <div className={styles["one-post_wrapper"]}>
            <div className={styles['one-post']}>

                <Spin />
            </div>
        </div>

    }



    const onDelete = () => {
        setIsPopupVisible(!isPopupVisible)
    }

    const onDeleteAgree = () => {
        deletePost({ slug, token })
    }

    const popUp = (<div className={styles['one-post_delete-popup']}>
        <p className={styles["one-post_popup-text"]}>Are you sure to delete this article?</p>
        <div className={styles["one-post_popup-button-wrapper"]}>
            <button type='button' className={styles['one-post_popup-disagree']} onClick={onDelete}>No</button>
            <button type='button' className={styles['one-post_popup-agree']} onClick={onDeleteAgree}>Yes</button>
        </div>
    </div>)

    const { article } = data
    const { title, tagList, favorited, favoritesCount, author, createdAt, description, body } = article

    const { username, image } = author
    const onSwitch = () => {
        const method = favorited ? 'DELETE' : 'POST'
        if (token) {
            switchFavorite({ slug, token, method })
        }
    }
    const isPostAuthor = username === loggedData?.user?.username


    const createdTime = format(new Date(createdAt), 'PPP')

    const tags = tagList.map(tagTitle => <Tag
        className={stylesHeader.post_tag}
        key={tagTitle + Math.random()}>
        {tagTitle.length > 20 ? `${tagTitle.substr(0, 20)}...` : tagTitle}
    </Tag>)

    return (
        <div className={styles["one-post_wrapper"]}>
            <div className={styles["one-post"]}>
                {isPopupVisible && popUp}
                <div className={stylesHeader.post_header}>
                    <div className={stylesHeader['post_article-header']}>
                        <div className={stylesHeader["post_article-title-wrapper"]}>

                            <h5 className={stylesHeader.post_title}>{title}</h5>

                            <div className={stylesHeader.post_likes}>
                                <LikeButton favorited={favorited} onSwitch={onSwitch} />
                                <div className={stylesHeader['post_likes-count']}>{favoritesCount}</div>

                            </div>
                        </div>
                        <div className={stylesHeader.post_tags}>{tags}</div>
                    </div>
                    <div className={stylesHeader["post_author-header"]}>
                        <div className={stylesHeader["post_author-wrapper"]}>
                            <div className={stylesHeader.post_username}>{
                                username
                            }</div>
                            <div className={stylesHeader["post_created-date"]}>{createdTime}</div>
                        </div>
                        <Avatar
                            size={46}
                            src={image}
                        />
                    </div>
                </div>
                <div className={stylesHeader.post_body}>
                    <div className={styles["one-post_description"]}>
                        <div className={styles["one-post_description-wrapper"]}>
                            <ReactMarkdown>
                                {description}
                            </ReactMarkdown>
                        </div>
                        {isPostAuthor && <div className={styles["one-post_author-buttons"]}>
                            <button type='button' className={styles['one-post_delete']} onClick={onDelete}>Delete</button>
                            <Link to={`/articles/${slug}/edit`} className={styles['one-post_edit']}>Edit</Link>
                        </div>}
                    </div>
                    <div className={stylesHeader["post_main-text"]}>
                        <ReactMarkdown>
                            {body}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OnePost;