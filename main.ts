import { Application } from 'https://deno.land/x/oak/mod.ts'
import userRoutes from './routes/users.ts'
import postRoutes from './routes/posts.ts'
import { baseUrl } from './common/constants.ts'

const app = new Application()

app.use(async (ctx, next) => {
  try {
    await next()
  }
  catch (err) {
    const statusCode = err.statusCode ?? 500

    ctx.response.status = statusCode
    ctx.response.body = {
      error: {
        statusCode,
        message: err.message || 'Internal server error',
      }
    }
  }
})

app.use(userRoutes.routes())
app.use(userRoutes.allowedMethods())
app.use(postRoutes.routes())
app.use(postRoutes.allowedMethods())

console.log(`🦕 Server running on port ${baseUrl}/`)
await app.listen({ port: 8000 })
