import { ServerContext } from "@/types/generic.types";
import {
  paginatedResponseCreator,
  responseCreator,
} from "@/utils/responseCreator";
import { UserService } from "./users-service";

export class UserHandler {
  constructor(private userService: UserService) {}

  getMe = async (c: ServerContext) => {
    const userProfileId = c.req.param("id");
    const user = await this.userService.findById(userProfileId);
    return c.json(paginatedResponseCreator(user));
  };

  updateMe = async (c: ServerContext) => {
    const userProfileId = c.req.param("id");
    const payload = await c.req.json();
    const user = await this.userService.update(userProfileId, payload);
    return c.json(
      responseCreator({
        success: true,
        data: user,
      })
    );
  };
}
