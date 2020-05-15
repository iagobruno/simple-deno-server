// @ts-ignore
export class HTTPError extends Error {
  constructor(
    public statusCode: number,
    public message?: string
  ) {
    super()
  }
}

/** Returns an error with status 404. */
export class NotFoundError extends HTTPError {
  constructor(message = 'Page not found.') {
    super(404, message)
  }
}

/** Returns an error with status 400. */
export class BadInputError extends HTTPError {
  constructor(message = 'This request contains an invalid input.') {
    super(400, message)
  }
}

/** Returns an error with status 500. */
export class InternalServerError extends HTTPError {
  constructor(message = 'An unexpected error has occurred.') {
    super(500, message)
  }
}
