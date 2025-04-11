import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppAbility, CaslAbilityFactory } from "../casl-ability.factory";
import { CHECK_POLICIES_KEY } from "../decorators/check-policies.decorator";
import { PolicyHandler, JobsPolicyHandlerCallback } from "../interfaces/policy-handler.interface";
import { JobsAuth } from "../../jobs/types/jobs-auth.enum";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyData = this.reflector.get<{
      endpoint: string;
      handlers: PolicyHandler[];
    }>(CHECK_POLICIES_KEY, context.getHandler());

    if (!policyData) {
      return false;
    }

    const policyHandlers = policyData["handlers"];
    const endpoint = policyData["endpoint"];
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    let jobType:string;
    if (endpoint === "jobs"){
      jobType = req.body.type;
    }


    const ability = this.caslAbilityFactory.endpointAccess(endpoint, user, jobType);
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === "function") {
      const res = handler(ability);
      return res;
    }
    return handler.handle(ability);
  }
}
