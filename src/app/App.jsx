import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store/store';
import Layout from '../layout/layout';
import Main from '../main/main';
import OnePost from '../one-post/one-post';
import SignIn from '../sign-in/sign-in';
import SignUp from '../sign-up/sign-up';
import EditProfile from '../edit-profile/edit-profile';
import ArticleForm from '../article-form/article-form';
import './App.scss'


function App() {

  return (
    <Provider store={store}>

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='sign-in' element={<SignIn />} />
          <Route path='sign-up' element={<SignUp />} />
          <Route path='articles' element={<Main />} />
          <Route path='articles/:slug/edit' element={<ArticleForm />} />
          <Route path='new-article' element={<ArticleForm />} />
          <Route path='profile' element={<EditProfile />} />
          <Route path='articles/:slug' element={<OnePost />} />
          <Route path='*' element={<h1>404</h1>} />
        </Route>
      </Routes>
    </Provider>

  );
}

export default App;
