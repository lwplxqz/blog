
import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Tag, Avatar, Spin } from 'antd';

import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import styles from './Post.module.scss'
import { useSwitchFavoriteMutation } from '../../store/postsApi';
import LikeButton from '../../shared/LikeButton';


function Post({ postData }) {

    const [switchFavorite, { isLoading }] = useSwitchFavoriteMutation()

    const { title, tagList, favorited, favoritesCount, author, createdAt, description, slug } = postData
    const { username, image } = author
    const token = localStorage.getItem('token')
    const tags = tagList.map(tagTitle => <Tag
        className={styles.post_tag}
        key={tagTitle + Math.random()}>
        {tagTitle.length > 20 ? `${tagTitle.substr(0, 20)}...` : tagTitle}
    </Tag>)

    const postTitle = title?.length > 40 ? `${title.substr(0, 40)}...` : title

    const onSwitch = () => {
        const method = favorited ? 'DELETE' : 'POST'
        if (token) {
            switchFavorite({ slug, token, method })
        }
    }


    const createdTime = format(new Date(createdAt), 'PPP')
    const postDescription = description?.length > 90 ? `${description.substr(0, 90)}...` : description


    return (<li className={styles.post}>
        <div className={styles.post_header}>
            <div className={styles['post_article-header']}>
                <div className={styles["post_article-title-wrapper"]}>
                    <Link to={`/articles/${slug}`}>
                        <h5 className={styles.post_title}>{postTitle}</h5>
                    </Link>
                    <div className={styles.post_likes}>
                        <LikeButton favorited={favorited} onSwitch={onSwitch} />
                        <div className={styles["post_likes-count"]}>{favoritesCount}</div>
                        {isLoading && <Spin />}
                    </div>
                </div>
                <div className={styles.post_tags}>{tags}</div>
            </div>
            <div className={styles["post_author-header"]}>
                <div className={styles["post_author-wrapper"]}>
                    <div className={styles.post_username}>{username}</div>
                    <div className={styles["post_created-date"]}>{createdTime}</div>
                </div>
                <Avatar
                    size={46}
                    src={image} />
            </div>
        </div>
        <div className={styles.post_body}>
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
