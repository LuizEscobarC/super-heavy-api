
export class UsersIncorrectlyPassword extends Error {
  constructor() {
    super('PAssword is incorrect')
  }
}