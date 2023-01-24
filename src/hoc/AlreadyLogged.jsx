import React from 'react';
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom';

function AlreadyLogged({ children }) {
    const token = localStorage.getItem('token')
    if (token) {
        return <Navigate to="/articles" />
    }

    return children;
}

export default AlreadyLogged;

AlreadyLogged.propTypes = {
    children: PropTypes.node.isRequired
}

