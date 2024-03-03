import { Context } from "hono";

type ServerVariables = {
  user: any
};

export interface ServerContext
  extends Context<{
    Variables: ServerVariables;
  }> {}

export type PaginationFilters = {
  skip: number;
  take: number;
  sort?: "asc" | "desc";
};
