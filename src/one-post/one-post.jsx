
import React, { useState, useEffect } from 'react';
import './one-post.scss'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tag, Avatar, Spin } from 'antd';
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux';
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { format } from 'date-fns';
import { useGetOnePostQuery, useGetLoggedUserQuery, useDeletePostMutation, useSwitchFavoriteMutation } from '../store/postsApi';


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
        return <div className="one-post_wrapper">
            <div className='one-post'>

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

    const popUp = (<div className='one-post_delete-popup'>
        <p className="one-post_popup-text">Are you sure to delete this article?</p>
        <div className="one-post_popup-button-wrapper">
            <button type='button' className='one-post_popup-disagree' onClick={onDelete}>No</button>
            <button type='button' className='one-post_popup-agree' onClick={onDeleteAgree}>Yes</button>
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

    const liked = favorited ?
        (<button type='button' className='post_button-like' onClick={onSwitch}>
            <HeartFilled style={{ color: '#FF0707' }} />
        </button>)
        :
        (<button type='button' className='post_button-like' onClick={onSwitch}>
            <HeartOutlined />
        </button>)

    const createdTime = format(new Date(createdAt), 'PPP')

    const tags = tagList.map(tagTitle => <Tag
        className='post_tag'
        key={tagTitle + Math.random()}>
        {tagTitle.length > 20 ? `${tagTitle.substr(0, 20)}...` : tagTitle}
    </Tag>)

    return (
        <div className="one-post_wrapper">
            <div className="one-post">
                {isPopupVisible && popUp}
                <div className='post_header'>
                    <div className='post_article-header'>
                        <div className="post_article-title-wrapper">

                            <h5 className="post_title">{title}</h5>

                            <div className="post_likes">
                                {liked}
                                <div className="post_likes-count">{favoritesCount}</div>
                            </div>
                        </div>
                        <div className="post_tags">{tags}</div>
                    </div>
                    <div className="post_author-header">
                        <div className="post_author-wrapper">
                            <div className="post_username">{
                                username
                            }</div>
                            <div className="post_created-date">{createdTime}</div>
                        </div>
                        <Avatar
                            size={46}
                            src={image}
                        />
                    </div>
                </div>
                <div className="post_body">
                    <div className="post_description one-post_description">
                        <div className="one-post_description-wrapper">
                            <ReactMarkdown>
                                {description}
                            </ReactMarkdown>
                        </div>
                        {isPostAuthor && <div className="one-post_author-buttons">
                            <button type='button' className='one-post_delete' onClick={onDelete}>Delete</button>
                            <Link to={`/articles/${slug}/edit`} className='one-post_edit'>Edit</Link>
                        </div>}
                    </div>
                    <div className="post_main-text">
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