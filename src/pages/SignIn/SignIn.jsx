
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Spin } from 'antd';
import './SignIn.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/loginSlice';
import { useLoginUserMutation } from '../../store/postsApi';

function SignIn() {

    const [loginUser, { data, error, isLoading }] = useLoginUserMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        register,
        formState: {
            errors
        },
        handleSubmit,

    } = useForm({
        mode: 'onChange'
    })




    useEffect(() => {
        if (data) {

            dispatch(setToken(data.user.token))
            localStorage.removeItem('token')
            localStorage.setItem('token', data.user.token)
            localStorage.setItem('loggedUser', data.user.username)
            navigate('/articles')
        }
    }, [data])



    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const onSubmit = ({ email, password }) => {
        loginUser({
            email: email.toLowerCase(), password
        })

    }

    const validateRequiredPattern = (required, pattern) => {
        const rules = {
            required: required ? 'Required field' : undefined,
            pattern: pattern ? {
                value: pattern,
                message: 'Type correct value'
            } : undefined
        }
        return rules
    }

    return (
        <div className="sign-in_wrapper">

            <form
                className='sign-in_form'
                onSubmit={handleSubmit(onSubmit)}>
                <h5 className='sign-in_title'>Sign in</h5>
                <label
                    htmlFor='email'
                    className='sign-in_label'>
                    Email addres
                    <input
                        type='text'
                        id='email'
                        placeholder='Email addres'
                        className='sign-in_input'{...register('email', validateRequiredPattern(true, emailPattern))} />

                    {errors?.email && <p className='sign-in_error'>{errors.email.message}</p>}

                </label>

                <label
                    htmlFor='password'
                    className='sign-in_label'>
                    Password
                    <input
                        type='password'
                        id='password'
                        placeholder='Password'
                        className='sign-in_input'{...register('password', validateRequiredPattern(true))} />

                    {errors?.password && <p className='sign-in_error'>{errors.password.message}</p>}

                </label>
                {error?.data && <p className='sign-in_error'>Email or password {Object.entries(error.data.errors)[0][1]}</p>}
                {isLoading && <Spin />}

                <input type="submit" className='sign-in_button' value='Login' />
                <p className="sign-in_to-sign-up">
                    Don’t have an account?
                    <Link className='sign-in_link-sign-up'
                        to='/sign-up'>{' Sign Up'}
                    </Link>.</p>
            </form>
        </div>

    );
}

export default SignIn;

