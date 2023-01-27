
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCreateArticleMutation, useGetOnePostQuery, useEditArticleMutation } from '../../store/postsApi';

import styles from './ArticleForm.module.scss'

function getDataArticleForm() {
    const { slug } = useParams()
    const { data, isLoading } = useGetOnePostQuery({ slug }, {
        skip: !slug
    })
    let isEditing = false
    const loggedUser = localStorage.getItem('loggedUser')

    if (slug) {
        isEditing = true
    }
    if (isLoading) {
        return <Spin />
    }

    if (isEditing && loggedUser) {
        if (loggedUser !== data?.article?.author.username) {
            return <Navigate to='/articles' />
        }
    }


    return (<ArticleForm isEditing={isEditing} postData={data} />);
}

function ArticleForm({ isEditing, postData }) {

    const token = localStorage.getItem('token')

    const navigate = useNavigate()

    const article = postData ? postData.article : undefined

    const [createArticle, { data: createdData, error: createdError }] = useCreateArticleMutation()

    const [editArticle, { data: editedData, error: editedError }] = useEditArticleMutation()



    const data = createdData || editedData
    const error = editedError || createdError

    useEffect(() => {
        if (data) {
            navigate(`/articles/${data.article.slug}`)
        }
    }, [data])

    const defaultTagsValues = article?.tagList.map(elem => ({ tag: elem }))

    const defaultValues = isEditing ? ({
        title: article?.title,
        body: article?.body,
        description: article?.description,
        tags: defaultTagsValues
    }) : undefined

    const {
        register,
        reset,
        control,
        formState: {
            errors
        },
        handleSubmit,

    } = useForm({
        mode: 'onChange',
        defaultValues
    })

    const requiredField = {
        required: {
            value: true,
            message: "Required field"
        }
    }

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tags"
    });

    useEffect(() => {
        if (!token) {
            navigate('/sign-in')
        }
        if (!isEditing) {
            reset()
        }
    }, [])
    const slug = article?.slug
    const onPost = ({ title, body, description, tags }) => {
        const postTags = tags.map(elem => elem.tag)

        const articleData = { title, body, description, tagList: postTags }
        if (!slug) {
            createArticle({ articleData, token })
        }
        if (slug) {
            editArticle({ articleData, token, slug })
        }

    }

    return (
        <div className={styles["article-form_wrapper"]}>
            <form
                onSubmit={handleSubmit(onPost)}
                className={styles["article-form_form"]}>
                {error && <div className={styles['article-form_error']}>Server error, try again l8r</div>}
                <h5 className={styles["article-form_title"]}>{slug ? 'Edit article' : 'Create new article'}</h5>
                <label
                    htmlFor="title"
                    className={styles["article-form_label"]}>
                    Title
                    <input
                        type="text"
                        id="title"
                        className={styles["article-form_input"]}
                        placeholder='Title'
                        {...register('title', requiredField)} />
                    {errors?.title && <p className={styles['article-form_error']}>{errors.title.message}</p>}
                </label>
                <label
                    htmlFor="description"
                    className={styles["article-form_label"]}>
                    Short description
                    <input
                        type="text"
                        id="description"
                        className={styles["article-form_input"]}
                        placeholder='Description'
                        {...register('description', requiredField)} />
                    {errors?.description && <p className={styles['article-form_error']}>{errors.description.message}</p>}
                </label>
                <label
                    htmlFor="body"
                    className={styles["article-form_label"]}>
                    Text
                    <textarea id="body" className={styles["article-form_textarea"]}
                        placeholder='Text' {...register('body', requiredField)} />
                    {errors?.body && <p className={styles['article-form_error']}>{errors.body.message}</p>}
                </label>
                <label
                    htmlFor="tag"
                    className={styles["article-form_label-tag"]}>
                    Tags
                    {fields.map((item, index) => (
                        <div key={item.id}>
                            <div className={styles["article-form_tag-wrapper"]} >
                                <input type="text"
                                    className={styles["article-form_input-tag"]}
                                    placeholder='Tag'
                                    {...register(`tags.${index}.tag`, requiredField)} />
                                <button type='button' className={styles['article-form_delete-tag']} onClick={() => remove(index)}>Delete</button>
                            </div>
                            {errors?.tags && <p className={styles['article-form_error-tag']}>{errors?.tags[index]?.tag.message}</p>}
                        </div>
                    ))}
                    <button type='button' className={styles['article-form_add-tag']} onClick={() => append({ tag: '' })
                    }>Add tag</button>
                </label>
                <input type="submit" value="Send" className={styles['article-form_button']} />
            </form>
        </div>
    );
}

export default getDataArticleForm;

ArticleForm.defaultProps = {
    isEditing: false,
    postData: {},
}

ArticleForm.propTypes = {
    isEditing: PropTypes.bool,
    postData: PropTypes.objectOf(Object),
}
