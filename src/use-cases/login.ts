import { compare } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UsersNotFoundError } from './errors/users-not-found-error'
import { UsersIncorrectlyPassword } from './errors/users-incorrecty-pass-error'

interface LoginUseCaseRequest {
    email: string
    password: string
};

export class LoginUserCase {

  constructor(private usersRepository: UsersRepository ) {}

  async execute({
    email,
    password
  }: LoginUseCaseRequest)
  {
    const user = await this.usersRepository.findByEmail(email)

    if (user === null) {
      throw new UsersNotFoundError()
    }

    if (! await compare(password, user.password_hash)) {
      throw new UsersIncorrectlyPassword()
    }

    const paylod = {
      id:  user.id,
      name: user.name
    }
    
    return paylod
  }
}