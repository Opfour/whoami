export class WaiError extends Error {
  constructor(
    message: string,
    public exitCode: number,
  ) {
    super(message);
    this.name = 'WaiError';
  }
}

export class UsageError extends WaiError {
  constructor(message: string) {
    super(message, 2);
    this.name = 'UsageError';
  }
}

export class AuthError extends WaiError {
  constructor(message: string) {
    super(message, 3);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends WaiError {
  constructor(message: string) {
    super(message, 4);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends WaiError {
  constructor(message: string) {
    super(message, 5);
    this.name = 'ConflictError';
  }
}
