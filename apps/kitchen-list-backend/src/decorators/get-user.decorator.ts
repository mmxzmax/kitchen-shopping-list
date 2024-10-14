import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IUser } from "../users/models/user.interface";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user as IUser
      return data ? user[data] : user;
    },
  );