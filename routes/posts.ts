import { Router } from 'https://deno.land/x/oak/mod.ts'
import { posts, IPost } from '../data.ts'
import { BadInputError, NotFoundError } from '../common/httpErrors.ts'
import { baseUrl } from '../common/constants.ts'

const router = new Router()

router.get('/posts', ({ response, request }) => {
  // @ts-ignore
  let searchParams = Object.fromEntries(request.url?.searchParams?.entries()) as Record<string, number>
  const page = Number(searchParams.page ?? 1)
  const pageSize = Number(searchParams.pageSize ?? 10)

  let data = [...posts]
    // @ts-ignore
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice((page - 1) * pageSize, page * pageSize)
    .map(post => ({
      ...post,
      url: `${baseUrl}/users/${post.authorId}/posts/${post.id}`,
      authorUrl: `${baseUrl}/users/${post.authorId}`,
    }))

  response.body = {
    data,
    total: posts.length,
    hasMore: (posts.length / pageSize) > page,
    nextPage: `${baseUrl}/posts?page=${page+1}&pageSize=${pageSize}`
  }
})

router.get('/users/:user_id/posts', ({ response, params }) => {
  const { user_id } = params
  const data = posts.filter(post => post.authorId === user_id)
    // @ts-ignore
    .sort((a, b) => b.createdAt - a.createdAt)

  response.body = {
    data,
    total: data.length,
  }
})

router.get('/users/:user_id/posts/:post_id', ({ response, params }) => {
  const { post_id, user_id } = params
  const post = posts.find(post => post.id == post_id && post.authorId == user_id)

  if (!post) throw new NotFoundError('Post not found!')

  response.body = post
})

router.post('/posts', async ({ request, response }) => {
  const newPostData = await request.body().then(b => b.value as IPost) ?? {}

  if (!('title' in newPostData)) throw new BadInputError('"title" missing field.')
  if (!('content' in newPostData)) throw new BadInputError('"content" missing field.')

  const id = String(posts.length + 1)
  const authorId = '1'

  posts.push({
    ...newPostData,
    id,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  response.body = {
    message: 'Post created successfully!',
    url: `${baseUrl}/users/${authorId}/posts/${id}`
  }
  response.status = 201
})

router.patch('/users/:user_id/posts/:post_id', async ({ params, request, response }) => {
  const { post_id, user_id } = params
  const newData = await request.body().then(b => b.value as Record<string, string>) ?? {}

  const index = posts.findIndex(post => post.id == post_id && post.authorId == user_id)
  if (index === -1) throw new NotFoundError('Post not found!')

  for (const field in newData) {
    // @ts-ignore
    posts[index][field] = newData[field]
  }

  response.body = {
    message: 'Post updated successfully!'
  }
})

router.delete('/users/:user_id/posts/:post_id', ({ params, response }) => {
  const { post_id, user_id } = params

  const index = posts.findIndex(post => post.id == post_id && post.authorId == user_id)
  if (index === -1) throw new NotFoundError('Post not found!')

  posts.splice(index, 1)

  response.body = {
    message: 'Post deleted successfully!'
  }
})

export default router
