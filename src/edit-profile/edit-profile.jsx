
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Spin } from 'antd';
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useEditUserMutation } from '../store/postsApi';
import './edit-profile.scss'



function EditProfile() {

    const token = localStorage.getItem('token')

    const { email: defaultEmail, username: defaultUsername } = useSelector(store => store.login)

    const [editUser, { error, isLoading }] = useEditUserMutation()

    const {
        register,

        formState: {
            errors
        },
        handleSubmit,

    } = useForm({
        mode: 'onChange',
        defaultValues: {
            email: defaultEmail,
            username: defaultUsername
        }
    })

    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const urlPattern = /([a-z\-_0-9/:.]*\.(jpg|jpeg|png|gif))/i


    const onSave = (formData) => {
        const dataEntries = Object.entries(formData)
        const userData = {}
        dataEntries.forEach(([key, value]) => {
            if (value !== '') {
                userData[key] = value
            }
        })
        editUser({ userData, token })
    }


    return (<div className="edit-profile_wrapper">
        <form className="edit-profile_form" onSubmit={handleSubmit(onSave)}>
            <h5 className="edit-profile_title">Edit profile</h5>
            <label htmlFor="username" className='edit-profile_label'>
                Username
                <input
                    type="text"
                    name="username"
                    id="username"
                    className='edit-profile_input'
                    placeholder='Username'

                    {...register('username', {
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
                {errors?.username && <p className='edit-profile_error'>{errors.username.message}</p>}
                {error?.data.errors.username && <p className='sign-in_error'>Username {error.data.errors.username}</p>}
            </label>

            <label
                htmlFor='email'
                className='edit-profile_label'>
                Email addres
                <input
                    type='text'
                    id='email'
                    placeholder='Email addres'
                    className='edit-profile_input'{...register('email', {
                        required: 'Введите Email',

                        pattern: {
                            value: emailPattern,
                            message: 'Введите корректый Email'
                        }
                    })} />
                {errors?.email && <p className='edit-profile_error'>{errors.email.message}</p>}
                {error?.data.errors.email && <p className='sign-in_error'>Email {error.data.errors.email}</p>}
            </label>

            <label
                htmlFor='password'
                className='edit-profile_label'>
                New password
                <input
                    type='password'
                    id='password'
                    className='edit-profile_input'
                    placeholder='New password'
                    {...register("password", {
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
                {errors?.password && <p className='edit-profile_error'>{errors.password.message}</p>}
            </label>

            <label
                htmlFor='image'
                className='edit-profile_label'>
                Avatar image (url)
                <input
                    type="text"
                    id="image"
                    placeholder='Avatar image'
                    className='edit-profile_input'
                    {...register('image', {
                        pattern: {
                            value: urlPattern,
                            message: 'Введите корректный url'
                        }
                    })}
                />
                {errors?.image && <p className='edit-profile_error'>{errors.image.message}</p>}
            </label>
            {isLoading && <Spin />}
            <input
                type="submit"
                value="Save"
                className='edit-profile_button' />
        </form>
    </div>);
}

export default EditProfile;