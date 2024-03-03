import { ServerException, ServiceException } from "@/exceptions";
import { ZodError } from "zod";

export const errorHandler = (error: unknown, message?: string) => {
  if (error instanceof ZodError) {
    const message = error.errors.map((e) => e.message).join(" and ");
    throw new ServiceException(message);
  } else if (error) {
    throw new ServiceException(message || (error as any)?.message);
  } else {
    throw new ServerException();
  }
};
