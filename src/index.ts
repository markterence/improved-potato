import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'
import { env } from 'hono/adapter'

import routes from './routes.js'
const app = new Hono()
 
app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
 
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('AUTH_TOKEN is not set')
  process.exit(1)
}

// app.use('/api/*', bearerAuth({ token: AUTH_TOKEN }));

routes(app)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
