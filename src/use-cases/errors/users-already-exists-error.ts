
export class UsersAlreadyExistsError extends Error {
  constructor() {
    super('User already exists')
  }
}