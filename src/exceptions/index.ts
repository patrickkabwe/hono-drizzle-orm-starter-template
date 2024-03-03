export class ServiceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceException";
  }
}

export class ServerException extends Error {
  constructor() {
    super("Unexpected error occurred");
    this.name = "ServerException";
  }
}
