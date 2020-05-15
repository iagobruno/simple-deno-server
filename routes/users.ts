import { Router } from 'https://deno.land/x/oak/mod.ts'
import { users, IUser } from '../data.ts'
import { BadInputError, NotFoundError } from '../common/httpErrors.ts'
import { baseUrl } from '../common/constants.ts'

const router = new Router()

router.get('/users', ({ response, request }) => {
  let searchParams = Object.fromEntries(request.url?.searchParams?.entries())
  const page = Number(searchParams.page ?? 1)
  const pageSize = Number(searchParams.pageSize ?? 10)

  let data = users
    .slice((page - 1) * pageSize, page * pageSize)
    .map(user => ({
      ...user,
      url: `${baseUrl}/users/${user.id}`,
      postsUrl: `${baseUrl}/users/${user.id}/posts`,
    }))

  response.body = {
    data,
    total: users.length,
    hasMore: (users.length / pageSize) > page,
    nextPage: `${baseUrl}/users?page=${page+1}&pageSize=${pageSize}`
  }
})

router.get('/users/:user_id', ({ response, params }) => {
  const { user_id } = params
  const user = users.find(user => user.id == user_id)

  if (!user) throw new NotFoundError('User not found!')

  response.body = user
})

router.post('/users', async ({ request, response }) => {
  const newUserData = await request.body().then(b => b.value as IUser) ?? {}

  if (!('name' in newUserData)) throw new BadInputError('"name" missing field.')
  if (!('password' in newUserData)) throw new BadInputError('"password" missing field.')
  if (!('email' in newUserData)) throw new BadInputError('"email" missing field.')
  if (!/^\w+([\.-]?\w+)*@\w+(\.com)+$/i.test(newUserData.email)) throw new BadInputError('"email" invalid field.')

  const id = String(users.length + 1)

  users.push({
    ...newUserData,
    id,
  })

  response.body = {
    message: 'User created successfully!',
    url: `${baseUrl}/users/${id}`
  }
  response.status = 201
})

router.patch('/users/:user_id', async ({ params, request, response }) => {
  const { user_id } = params
  const newData = await request.body().then(b => b.value as Record<string, string>) ?? {}

  const index = users.findIndex(user => user.id == user_id)
  if (index === -1) throw new NotFoundError('User not found!')

  for (const field in newData) {
    // @ts-ignore
    users[index][field] = newData[field]
  }

  response.body = {
    message: 'User updated successfully!'
  }
})

router.delete('/users/:user_id', ({ params, response }) => {
  const { user_id } = params

  const index = users.findIndex(user => user.id == user_id)
  if (index === -1) throw new NotFoundError('User not found!')

  users.splice(index, 1)

  response.body = {
    message: 'User deleted successfully!'
  }
})

export default router
