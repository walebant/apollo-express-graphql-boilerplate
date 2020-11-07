import { ApolloError } from 'apollo-server-express';

export class BAD_REQUEST_ERROR extends ApolloError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = 400;
  }
}

export class UNAUTHORIZED_ERROR extends ApolloError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = 401;
  }
}

export class FORBIDDEN_ERROR extends ApolloError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = 403;
  }
}

export class NOT_FOUND_ERROR extends ApolloError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = 404;
  }
}

export class SERVER_ERROR extends ApolloError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = 500;
  }
}
