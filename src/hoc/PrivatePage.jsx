
import React from 'react';
import PropTypes from 'prop-types'

import { Navigate } from 'react-router-dom';

function PrivatePage({ children }) {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to="/sign-in" />
    }

    return children;
}

export default PrivatePage;

PrivatePage.propTypes = {
    children: PropTypes.node.isRequired
}
