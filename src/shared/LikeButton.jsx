import React from 'react';
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import stylesHeader from "../components/Post/Post.module.scss"

function LikeButton({ favorited, onSwitch }) {

    const liked = favorited ?
        (<button type='button' className={stylesHeader['post_button-like']} onClick={onSwitch}>
            <HeartFilled style={{ color: '#FF0707' }} />
        </button>)
        :
        (<button type='button' className={stylesHeader['post_button-like']} onClick={onSwitch}>
            <HeartOutlined />
        </button>)

    return liked;
}

export default LikeButton;