import { ServerContext } from "@/types/generic.types";
import {
  paginatedResponseCreator,
  responseCreator,
} from "@/utils/responseCreator";
import { UserService } from "./users-service";

export class UserHandler {
  constructor(private userService: UserService) {}

  getById = async (c: ServerContext) => {
    const userId = c.req.param("id");
    const user = await this.userService.findById(userId);
    return c.json(paginatedResponseCreator(user));
  };

  getMe = async (c: ServerContext) => {
    const userId = c.get("user").id;
    const user = await this.userService.findById(userId);
    return c.json(paginatedResponseCreator(user));
  };

  updateMe = async (c: ServerContext) => {
    const userId = c.req.param("id");
    const payload = await c.req.json();
    const user = await this.userService.update(userId, payload);
    return c.json(
      responseCreator({
        success: true,
        data: user,
      })
    );
  };
}
