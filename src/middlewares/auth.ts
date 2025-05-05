import { FastifyReply, FastifyRequest } from 'fastify'

export const auth = async function auth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' })
  }
}