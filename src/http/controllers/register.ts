
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUserCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersAlreadyExistsError } from '@/use-cases/errors/users-already-exists-error'

export  async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })
  
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUserCase = new RegisterUserCase(usersRepository)
    
    await registerUserCase.execute({ 
      name,
      email,
      password
    })
  } catch (err) {
    if (err instanceof UsersAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}