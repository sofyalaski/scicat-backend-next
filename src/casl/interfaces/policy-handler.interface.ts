import { AppAbility } from "../casl-ability.factory";
import { JobsAuth } from "../../jobs/types/jobs-auth.enum";

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;


export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export type JobsPolicyHandlerCallback = (ability: AppAbility, jobsType: JobsAuth) => boolean;
