import React from 'react';
import PostList from '../PostList/PostList';

import styles from './Main.module.scss'

function Main() {
    return (
        <main className={styles.main}>
            <PostList />
        </main>
    );
}

export default Main;