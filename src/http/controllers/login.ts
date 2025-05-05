
import { FastifyRequest, FastifyReply, fastify } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersAlreadyExistsError } from '@/use-cases/errors/users-already-exists-error'
import { LoginUserCase } from '@/use-cases/login'

export  async function login(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
  
  const { email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const loginUserCase = new LoginUserCase(usersRepository)
    
    const paylod = await loginUserCase.execute({ 
      email,
      password
    })

    const token = request.server.jwt.sign(paylod, {
      expiresIn: '1d'
    })


    return reply.send({ token })

  } catch (err) {
    if (err instanceof UsersAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}