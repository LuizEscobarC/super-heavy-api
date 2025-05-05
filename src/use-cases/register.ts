import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UsersAlreadyExistsError } from './errors/users-already-exists-error'

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
};

export class RegisterUserCase {

  constructor(private usersRepository: UsersRepository ) {}

  async execute({
    name,
    email,
    password
  }: RegisterUseCaseRequest)
  {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    
    if (userWithSameEmail) {
      throw new UsersAlreadyExistsError()
    }
      
    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}