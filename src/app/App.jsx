import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store/store';
import Layout from '../pages/Layout/Layout';
import Main from '../pages/Main/Main';
import OnePost from '../pages/OnePost/OnePost';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import EditProfile from '../pages/EditProfile/EditProfile';
import ArticleForm from '../pages/ArticleForm/ArticleForm';
import PrivatePage from '../hoc/PrivatePage';
import AlreadyLogged from '../hoc/AlreadyLogged';
import './App.scss'


function App() {

  return (
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='sign-in' element={
            <AlreadyLogged>
              <SignIn />
            </AlreadyLogged>
          } />
          <Route path='sign-up' element={
            <AlreadyLogged>
              <SignUp />
            </AlreadyLogged>
          } />
          <Route path='articles' element={<Main />} />
          <Route path='articles/:slug/edit' element={
            <PrivatePage>
              <ArticleForm />
            </PrivatePage>
          } />
          <Route path='new-article' element={
            <PrivatePage>
              <ArticleForm />
            </PrivatePage>
          } />
          <Route path='profile' element={
            <PrivatePage>
              <EditProfile />
            </PrivatePage>
          } />
          <Route path='articles/:slug' element={<OnePost />} />
          <Route path='*' element={<h1>404</h1>} />
        </Route>
      </Routes>
    </Provider>

  );
}

export default App;
