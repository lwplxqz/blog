
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Spin } from 'antd';
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useEditUserMutation } from '../../store/postsApi';
import styles from './EditProfile.module.scss'



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

    return (<div className={styles["edit-profile_wrapper"]}>
        <form className={styles["edit-profile_form"]} onSubmit={handleSubmit(onSave)}>
            <h5 className={styles["edit-profile_title"]}>Edit profile</h5>
            <label htmlFor="username" className={styles['edit-profile_label']}>
                Username
                <input
                    type="text"
                    name="username"
                    id="username"
                    className={styles['edit-profile_input']}
                    placeholder='Username'

                    {...register('username', validateRequiredPatternMinMax(true, /^[a-z0-9]*$/, 3, 20)
                    )} />
                {errors?.username && <p className={styles['edit-profile_error']}>{errors.username.message}</p>}
                {error?.data.errors.username && <p className={styles['edit-profile_error']}>Username {error.data.errors.username}</p>}
            </label>

            <label
                htmlFor='email'
                className={styles['edit-profile_label']}>
                Email addres
                <input
                    type='text'
                    id='email'
                    placeholder='Email addres'
                    className={styles['edit-profile_input']}{...register('email', validateRequiredPatternMinMax(true, emailPattern)
                    )} />
                {errors?.email && <p className={styles['edit-profile_error']}>{errors.email.message}</p>}
                {error?.data.errors.email && <p className={styles['edit-profile_error']}>Email {error.data.errors.email}</p>}
            </label>

            <label
                htmlFor='password'
                className={styles['edit-profile_label']}>
                New password
                <input
                    type='password'
                    id='password'
                    className={styles['edit-profile_input']}
                    placeholder='New password'
                    {...register("password", validateRequiredPatternMinMax(false, false, 6, 40)
                    )}
                />
                {errors?.password && <p className={styles['edit-profile_error']}>{errors.password.message}</p>}
            </label>

            <label
                htmlFor='image'
                className={styles['edit-profile_label']}>
                Avatar image (url)
                <input
                    type="text"
                    id="image"
                    placeholder='Avatar image'
                    className={styles['edit-profile_input']}
                    {...register('image', validateRequiredPatternMinMax(false, urlPattern)
                    )}
                />
                {errors?.image && <p className={styles['edit-profile_error']}>{errors.image.message}</p>}
            </label>
            {isLoading && <Spin />}
            <input
                type="submit"
                value="Save"
                className={styles['edit-profile_button']} />
        </form>
    </div>);
}

export default EditProfile;