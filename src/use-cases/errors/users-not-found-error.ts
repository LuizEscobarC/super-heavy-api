
export class UsersNotFoundError extends Error {
  constructor() {
    super('User Not Found')
  }
}