
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blog.kata.academy/api/'
    }),
    tagTypes: ['userData', 'postsData', 'onePost'],
    endpoints: (build) => ({
        getPosts: build.query({
            query: ({ offset, token }) => ({
                url: 'articles',
                headers: (token ? {
                    Authorization: `Token ${token}`,
                } : undefined),
                params: {
                    offset,
                    limit: 5
                }
            }),
            providesTags: () => ['postData']
        }),
        getOnePost: build.query({
            query: ({ slug, token }) => ({
                url: `articles/${slug}`,
                headers: (token ? {
                    Authorization: `Token ${token}`,
                } : undefined),
            }),
            providesTags: () => ['onePost']
        }),
        createUser: build.mutation({
            query: (userData) => ({
                url: 'users',
                method: 'POST',
                body: { user: userData }
            })
        }),
        loginUser: build.mutation({
            query: (userData) => ({
                url: 'users/login',
                method: 'POST',
                body: { user: userData },
            })
        }),
        getLoggedUser: build.query({
            query: (token) => (
                {
                    url: 'user',
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                }),

            providesTags: () => ['userData']
        }),

        editUser: build.mutation({
            query: ({ userData, token }) => ({
                url: 'user',
                method: 'PUT',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: {
                    user: userData
                },

            }),
            invalidatesTags: ['userData']
        }),

        createArticle: build.mutation({
            query: ({ articleData, token }) => ({
                url: 'articles',
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: {
                    article: articleData
                },
                invalidatesTags: ['postData']
            })
        }),

        editArticle: build.mutation({
            query: ({ articleData, token, slug }) => ({
                url: `articles/${slug}`,
                method: 'PUT',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: {
                    article: articleData
                }
            }),
            invalidatesTags: ['onePost']
        }),
        deletePost: build.mutation({
            query: ({ slug, token }) => ({
                url: `articles/${slug}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json;charset=utf-8',
                }
            }),
            invalidatesTags: ['postData']
        }),
        switchFavorite: build.mutation({
            query: ({ slug, token, method }) => ({
                url: `articles/${slug}/favorite`,
                method,
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json;charset=utf-8',
                }
            }),
            invalidatesTags: ['postData', 'onePost']
        })
    })

})

export const {
    useGetPostsQuery,
    useGetOnePostQuery,
    useCreateUserMutation,
    useLoginUserMutation,
    useGetLoggedUserQuery,
    useEditUserMutation,
    useCreateArticleMutation,
    useEditArticleMutation,
    useDeletePostMutation,
    useSwitchFavoriteMutation
} = postsApi