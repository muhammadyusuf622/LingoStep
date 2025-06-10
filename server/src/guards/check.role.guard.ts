import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "@prisma/client";
import { ROLES_KEY } from "src/decaratores";

@Injectable()
export class CheckRoleGuard implements CanActivate{
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): any{
    
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & {role?: UserRoles, userId: string}>();

      const roles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY ,[
      context.getHandler(),
      context.getClass(),
    ]);

    let userRole: any = request.role;
    if(!roles || !roles.includes( userRole )){
       throw new ForbiddenException('You cannot perform this action');
    }

    return true
  }
}