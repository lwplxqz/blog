
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCreateArticleMutation, useGetOnePostQuery, useEditArticleMutation } from '../store/postsApi';

import './article-form.scss'

function getDataArticleForm() {

    const { slug } = useParams()

    const { data, isLoading } = useGetOnePostQuery({ slug }, {
        skip: !slug
    })
    let isEditing = false

    if (slug) {
        isEditing = true
    }
    if (isLoading) {
        return <Spin />
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
        <div className="article-form_wrapper">
            <form
                onSubmit={handleSubmit(onPost)}
                className="article-form_form">
                {error && <div className='article-form_error'>Server error, try again l8r</div>}
                <h5 className="article-form_title">{slug ? 'Edit article' : 'Create new article'}</h5>
                <label
                    htmlFor="title"
                    className="article-form_label">
                    Title
                    <input
                        type="text"
                        id="title"
                        className="article-form_input"
                        placeholder='Title'
                        {...register('title', {
                            required: {
                                value: true,
                                message: "Required field"
                            }
                        })} />
                    {errors?.title && <p className='article-form_error'>{errors.title.message}</p>}
                </label>
                <label
                    htmlFor="description"
                    className="article-form_label">
                    Short description
                    <input
                        type="text"
                        id="description"
                        className="article-form_input"
                        placeholder='Description'
                        {...register('description', {
                            required: {
                                value: true,
                                message: "Required field"
                            }
                        })} />
                    {errors?.description && <p className='article-form_error'>{errors.description.message}</p>}
                </label>
                <label
                    htmlFor="body"
                    className="article-form_label">
                    Text
                    <textarea id="body" className="article-form_input article-form_textarea"
                        placeholder='Text' {...register('body', {
                            required: {
                                value: true,
                                message: "Required field"
                            },
                        })} />
                    {errors?.body && <p className='article-form_error'>{errors.body.message}</p>}
                </label>
                <label
                    htmlFor="tag"
                    className="article-form_label article-form_label-tag">
                    Tags
                    {fields.map((item, index) => (
                        <div key={item.id}>
                            <div className="article-form_tag-wrapper" >
                                <input type="text" className="article-form_input article-form_input-tag" placeholder='Tag' {...register(`tags.${index}.tag`, {
                                    required: {
                                        value: true,
                                        message: "Required field"
                                    }
                                })} />
                                <button type='button' className='article-form_delete-tag' onClick={() => remove(index)}>Delete</button>
                            </div>
                            {errors?.tags && <p className='article-form_error article-form_error-tag'>{errors?.tags[index]?.tag.message}</p>}
                        </div>
                    ))}
                    <button type='button' className='article-form_add-tag' onClick={() => append({ tag: '' })
                    }>Add tag</button>
                </label>
                <input type="submit" value="Send" className='article-form_button' />
            </form>
        </div>
    );
}

export default getDataArticleForm;

ArticleForm.defaultProps = {
    postData: {}
}

ArticleForm.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    postData: PropTypes.objectOf(PropTypes.object()),
}
