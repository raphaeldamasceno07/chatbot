import { AppError } from './app-error.js'

export class ResourceNotFoundError extends AppError {
  constructor() {
    super('Resource not found.', 404)
  }
}
