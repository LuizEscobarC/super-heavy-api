import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { login } from './controllers/login'
import { auth } from '@/middlewares/auth'

export async function appRoutes(app: FastifyInstance) {
  app.post('/register', register)
  // app.get('/users', find)  TODO: Implement find
  app.post('/login', login)

  // TODO: IMPLEMENTS JWT
  app.get('/users', { 'preHandler': auth}, () => {
    return { message: 'Hello World' }
  })
  // app.put('/users/:id', update) TODO: Implement update
  // app.delete('/users/:id', remove) TODO: Implement remove
}