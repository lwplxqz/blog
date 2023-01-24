/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import './SignUp.scss'
import { Spin } from 'antd';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../../store/postsApi';


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

    const validateRequiredPatternMinMax = (required, pattern, min, max) => {
        const rules = {
            required: required ? 'Required field' : undefined,
            pattern: pattern ? {
                value: pattern,
                message: 'Type correct value'
            } : undefined,
            minLength: min ? {
                value: min,
                message: `Minimum length is ${min} symbols`
            } : undefined,
            maxLength: max ? {
                value: max,
                message: `Maximum length is ${max} symbols`
            } : undefined
        }
        return rules
    }

    return (
        <div className="sign-up_wrapper">
            <form className="sign-up_form"
                onSubmit={handleSubmit(onSubmit)}>
                <h5 className="sign-up_title">Create New Account</h5>
                <label htmlFor="username" className='sign-up_label'>
                    Username
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className='sign-up_input'
                        placeholder='Username'
                        {...register('username', validateRequiredPatternMinMax(true, /^[a-z0-9]*$/, 3, 20)
                        )} />
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
                        className='sign-up_input'
                        {...register('email', validateRequiredPatternMinMax(true, emailPattern))} />
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
                        {...register("password", validateRequiredPatternMinMax(true, undefined, 6, 40))}
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
                                    return "Passwords doesn't match";
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
                        validateRequiredPatternMinMax(true)
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