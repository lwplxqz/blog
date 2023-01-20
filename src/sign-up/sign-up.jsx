/* eslint-disable consistent-return */

/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect } from 'react';
import './sign-up.scss'
import { Spin } from 'antd';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../store/postsApi';


function SignUp() {

    const [createUser, { data, isLoading, error }] = useCreateUserMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (data) {
            localStorage.setItem('token', data.user.token)
            navigate('/sign-in')
        }
    }, [data])

    const {
        register,
        watch,
        formState: {
            errors
        },
        handleSubmit,
    } = useForm({
        mode: 'onChange'
    })

    const onSubmit = ({ email, password, username }) => {
        createUser({
            email: email.toLowerCase(), password, username

        })

    }

    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


    return (
        <div className="sign-up_wrapper">
            <form className="sign-up_form"
                onSubmit={handleSubmit(onSubmit)}>
                <h5 className="sign-up_title">Create New Account</h5>
                <label htmlFor="username" className='sign-up_label'>
                    Username
                    <input type="text" name="username" id="username" className='sign-up_input' placeholder='Username' {...register('username', {
                        required: 'Введите имя пользователя',
                        minLength: {
                            value: 3,
                            message: 'Минимальная длина имени пользователя должа составлять 3 символа'
                        },
                        maxLength: {
                            value: 20,
                            message: 'Максимальная длина имени пользователя должа составлять 20 символов'
                        },
                        pattern: {
                            value: /^[a-z0-9]*$/,
                            message: 'You can only use lowercase English letters and numbers',
                        }

                    })} />
                    {errors?.username && <p className='sign-up_error'>{errors.username.message}</p>}
                    {error?.data.errors.username && <p className='sign-in_error'>Username {error.data.errors.username}</p>}
                </label>

                <label
                    htmlFor='email'
                    className='sign-up_label'>
                    Email addres
                    <input
                        type='text'
                        id='email'
                        placeholder='Email addres'
                        className='sign-up_input'{...register('email', {
                            required: 'Введите Email',

                            pattern: {
                                value: emailPattern,
                                message: 'Введите корректый Email'
                            }
                        })} />
                    {errors?.email && <p className='sign-up_error'>{errors.email.message}</p>}
                    {error?.data.errors.email && <p className='sign-in_error'>Email {error.data.errors.email}</p>}
                </label>

                <label
                    htmlFor='password'
                    className='sign-up_label'>
                    Password
                    <input
                        type='password'
                        id='password'
                        className='sign-up_input'
                        placeholder='Password'
                        {...register("password", {
                            required: "Введите пароль",
                            minLength: {
                                value: 6,
                                message: 'Не менее 6 символов'
                            },
                            maxLength: {
                                value: 40,
                                message: 'Не более 40 символов'
                            },
                        })}
                    />
                    {errors?.password && <p className='sign-up_error'>{errors.password.message}</p>}
                </label>
                <label
                    htmlFor='confirm_password'
                    className='sign-up_label'>
                    Repeat password
                    <input
                        type='password'
                        id='confirm_password'
                        className='sign-up_input'
                        placeholder='Password'
                        {...register("confirm_password", {
                            required: true,
                            validate: (val) => {
                                if (watch('password') !== val) {
                                    return "Пароли не совпадают";
                                }
                            },
                        })}
                    />
                    {errors?.confirm_password && <p className='sign-up_error'>{errors.confirm_password.message}</p>}
                </label>

                <label
                    htmlFor='terms-agree'
                    className='sign-up_terms-agree'
                >

                    <input type="checkbox" name="terms-agree" id="terms-agree" className='sign-up_checkbox' {...register(
                        'terms_agree',
                        {
                            required: 'Обязательно к заполнению'
                        }
                    )} />
                    <div className='sign-up_terms-wrapper'>
                        I agree to the processing of my personal information
                        {errors?.terms_agree && <p className='sign-up_error'>{errors.terms_agree.message}</p>}

                    </div>

                </label>

                {isLoading && <Spin />}

                <input
                    type="submit"
                    value="Create"
                    className='sign-up_button' />
                <p className="sign-up_to-sign-in">
                    Already have an account?
                    <Link className='sign-up_link-sign-in'
                        to='/sign-in'>{' Sign In'}
                    </Link>.</p>
            </form>

        </div>
    );
}

export default SignUp;