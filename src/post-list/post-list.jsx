
import React, { useState } from 'react';
import { Pagination, Spin } from 'antd';



import Post from '../post/post';
import { useGetPostsQuery } from '../store/postsApi';
import './post-list.scss'

function PostList() {

    const [offset, setOffset] = useState(0)
    const token = localStorage.getItem('token')

    const { data, isLoading, isError } = useGetPostsQuery({ offset, token })


    if (isError) {
        return <h1>ERRORA</h1>
    }

    const onPaginationChange = (value) => {

        setOffset(value * 5 - 5)
    }


    if (isLoading) {
        return <Spin />
    }
    const { articles, articlesCount } = data

    const posts = articles.map((postData) => (<Post
        postData={postData}
        key={postData.slug}
    />))



    return (<>
        <ul className='post-list'>{posts}</ul>
        <Pagination
            onChange={onPaginationChange}
            total={articlesCount}
            pageSize={5}
            showSizeChanger={false}

        />
    </>
    );
}

export default PostList;