
import React from 'react';
import './Post.scss'
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Tag, Avatar, Spin } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import { useSwitchFavoriteMutation } from '../../store/postsApi';


function Post({ postData }) {

    const [switchFavorite, { isLoading }] = useSwitchFavoriteMutation()

    const { title, tagList, favorited, favoritesCount, author, createdAt, description, slug } = postData
    const { username, image } = author
    const token = localStorage.getItem('token')
    const tags = tagList.map(tagTitle => <Tag
        className='post_tag'
        key={tagTitle + Math.random()}>
        {tagTitle.length > 20 ? `${tagTitle.substr(0, 20)}...` : tagTitle}
    </Tag>)

    const postTitle = title.length > 40 ? `${title.substr(0, 40)}...` : title

    const onSwitch = () => {
        const method = favorited ? 'DELETE' : 'POST'
        if (token) {
            switchFavorite({ slug, token, method })
        }
    }

    const liked = favorited ?
        (<button type='button' className='post_button-like' onClick={onSwitch}>
            <HeartFilled style={{ color: '#FF0707' }} />
        </button>)
        :
        (<button type='button' className='post_button-like' onClick={onSwitch}>
            <HeartOutlined />
        </button>)

    const createdTime = format(new Date(createdAt), 'PPP')
    const postDescription = description.length > 90 ? `${description.substr(0, 90)}...` : description


    return (<li className='post'>
        <div className='post_header'>
            <div className='post_article-header'>
                <div className="post_article-title-wrapper">
                    <Link to={`/articles/${slug}`}>
                        <h5 className="post_title">{postTitle}</h5>
                    </Link>
                    <div className="post_likes">
                        {liked}
                        <div className="post_likes-count">{favoritesCount}</div>
                        {isLoading && <Spin />}
                    </div>
                </div>
                <div className="post_tags">{tags}</div>
            </div>
            <div className="post_author-header">
                <div className="post_author-wrapper">
                    <div className="post_username">{username}</div>
                    <div className="post_created-date">{createdTime}</div>
                </div>
                <Avatar
                    size={46}
                    src={image} />
            </div>
        </div>
        <div className="post_body">
            <ReactMarkdown>
                {postDescription}
            </ReactMarkdown>
        </div>
    </li>);
}

export default Post;

Post.defaultProps = {
    postData: {}
}

Post.propTypes = {
    postData: PropTypes.objectOf(Object),
}
